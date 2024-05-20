FROM node:20-alpine

COPY . /app

EXPOSE 8080:8080

WORKDIR /app
RUN npm i

#RUN apk update && apk add curl

CMD node /app/server.js