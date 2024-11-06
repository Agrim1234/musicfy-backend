import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import cors from "cors";
import path from 'path';
import { tagFileMap } from './constants.js';
import axios from 'axios';
import { promisify } from 'util';
import { PassThrough } from 'stream';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://musicfy-ai.vercel.app/", "http://127.0.0.1:3000"],
    credentials: true
}));

const unlinkAsync = promisify(fs.unlink);

// Set up file upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Route to trim audio
app.post('/trim', upload.single('audio'), (req, res) => {
    const { start, end } = req.body;
    console.log("values from req body: ", start, end);
    const inputPath = req.file?.path;
    console.log("file on request object: ", req.file)
    console.log("input path: ", inputPath)
    const outputPath = `uploads/trimmed-${Date.now()}.mp3`;

    ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(end - start)
        .output(outputPath)
        .on('end', () => res.download(outputPath, () => fs.unlinkSync(outputPath)))
        .on('error', (err: any) => res.status(500).send('Audio processing error: ' + err.message))
        .run();
});

// Route to adjust volume
app.post('/adjust-volume', upload.single('audio'), (req, res) => {
    const { volume } = req.body;
    const inputPath = req.file?.path;
    const outputPath = `uploads/volume-adjusted-${Date.now()}.mp3`;

    ffmpeg(inputPath)
        .audioFilters(`volume=${volume}`)
        .output(outputPath)
        .on('end', () => res.download(outputPath, () => fs.unlinkSync(outputPath)))
        .on('error', (err: any) => res.status(500).send('Audio processing error: ' + err.message))
        .run();
});

app.post('/generate-music-audio', async (req, res) => {

    console.log(req.body)
    const tempFilePath = path.join('./uploads', 'temp_output.mp3');
    const { fileInput,
        outputFile,
        clarityValue,
        speedValue,
        backgroundMusic } = req.body;
    const inputPath = fileInput;
    let tagData = 'uploads/jazz.mp3';
    if (tagFileMap.get(backgroundMusic) !== undefined) {
        tagData = tagFileMap.get(backgroundMusic) ?? 'uploads/jazz.mp3';
        console.log(tagData)
    }

    await new Promise((resolve, reject) => {
        ffmpeg(fileInput)
            .inputOptions(['-thread_queue_size 1024']) // Apply to input
            .input(tagData)
            .outputOptions([
                '-threads 2'
            ])
            .complexFilter([
                '[0:a]aloop=loop=-1:size=2147483647[a0]',  // Repeat fileInput indefinitely
                '[1:a]aloop=loop=-1:size=2147483647[a1]',  // Repeat tagData indefinitely
                '[a0][a1]amix=inputs=2:duration=longest'   
            ])
            .format('mp3')
            .outputOptions(['-t 30'])
            .output(tempFilePath)
            .on('end', resolve)
            .on('error', reject)
            .run();
    })

    try {
        const audioBuffer = fs.readFileSync(tempFilePath);
        console.log(audioBuffer)

        const responseUploadAudio: any = await axios.post('https://ojpwyux64l.execute-api.us-east-1.amazonaws.com/default/uploadMergedAudio', { fileName: outputFile, fileType: 'audio' }, {
            headers: {
                "Content-Type": "application/json",
            }
        })

        const presignedUrlOutput = responseUploadAudio.data.presignedUrl
        console.log("presigned url: ", presignedUrlOutput)

        const responsePutS3object: any = await axios.put(presignedUrlOutput, audioBuffer, {
            headers: {
                'Content-Type': 'audio/mp3',
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        console.log("audio uploaded: ", responsePutS3object)

        const responseFetchPresignedUrl = await axios.post('https://i6xasb8wxd.execute-api.us-east-1.amazonaws.com/default/fetchAudioFilePresignedUrl',
            { fileName: outputFile }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await responseFetchPresignedUrl.data;
        console.log("data from presigned url: ", data);
        res.send(JSON.stringify(data)); // Return the presigned URL in the response data);

    } catch (error) {
        res.send(error)
    } finally {
        // Clean up the temporary file
        if (fs.existsSync(tempFilePath)) {
            await unlinkAsync(tempFilePath);
        }
    }

});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));

