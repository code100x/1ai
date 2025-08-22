FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]

