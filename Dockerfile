FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm run start

EXPOSE 3001

CMD ["node", "dist/server.js"]
