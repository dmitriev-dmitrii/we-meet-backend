FROM node:24:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "start"]