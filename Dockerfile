FROM node:18-buster

WORKDIR /usr/src/app

COPY package* .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 5000
