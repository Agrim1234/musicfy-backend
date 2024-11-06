type tagFileDataProps = {
    id: string,
    tagName : string,
    fileName: string,
}

export const tagFileData = [
    {
        id: '1',
        tagName: 'joyful',
        fileName: 'uploads/joyride.mp3'
    },
    {
        id: '2',
        tagName: 'jazz',
        fileName: 'uploads/jazz.mp3'
    },
    {
        id: '3',
        tagName: 'contemporary pop/rock',
        fileName: 'uploads/wandering.mp3'
    },
    {
        id: '4',
        tagName: 'drums (drum set)',
        fileName: 'uploads/drums.mp3'
    },
    {
        id: '5',
        tagName: 'blues rock',
        fileName: 'uploads/jazz.mp3'
    },
    {
        id: '6',
        tagName: 'hard rock',
        fileName: 'uploads/hard-rock.mp3'
    },
    {
        id: '7',
        tagName: 'pop rock',
        fileName: 'uploads/joyride.mp3'
    },
    {
        id: '8',
        tagName: 'electro-swing',
        fileName: 'uploads/electro-swing.mp3'
    },
    {
        id: '9',
        tagName: 'bass guitar',
        fileName: 'uploads/bass.mp3'
    },
    {
        id: '10',
        tagName: 'rock',
        fileName: 'uploads/hard-rock.mp3'
    },
    {
        id: '11',
        tagName: 'soft rock',
        fileName: 'uploads/hard-rock.mp3'
    },
    {
        id: '12',
        tagName: 'guitar',
        fileName: 'uploads/bass.mp3'
    },
    {
        id: '13',
        tagName: 'pop-metal',
        fileName: 'uploads/joyride.mp3'
    },
    {
        id: '14',
        tagName: 'pop',
        fileName: 'uploads/pop.mp3'
    },
    {
        id: '15',
        tagName: 'rock ballad',
        fileName: 'uploads/hard-rock.mp3'
    },
    {
        id: '16',
        tagName: 'rock and roll',
        fileName: 'uploads/bass.mp3'
    },
    {
        id: '17',
        tagName: 'electric guitar',
        fileName: 'uploads/guitarelectric.mp3'
    },
    {
        id: '18',
        tagName: 'prog-rock',
        fileName: 'uploads/guitar.mp3'
    },
    {
        id: '19',
        tagName: 'acoustic',
        fileName: 'uploads/upbeat.mp3'
    },
    {
        id: '20',
        tagName: 'Upbeat',
        fileName: 'uploads/upbeat.mp3'
    }
]

export const tagFileMap = new Map(tagFileData.map(item => [item.tagName, item.fileName]));


  