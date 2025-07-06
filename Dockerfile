FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY . .

RUN npm run install
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
