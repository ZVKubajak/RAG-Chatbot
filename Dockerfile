FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm run install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
