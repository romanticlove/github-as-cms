FROM node:12.14.1-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk update
RUN apk add --no-cache git
RUN npm i pm2 -g

COPY package.json package-lock.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

RUN npm run build

EXPOSE 3000
CMD pm2-docker index.js
