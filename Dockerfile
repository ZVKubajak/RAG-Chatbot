FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN apt-get update -y && apt-get install -y openssl
RUN npm run install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
