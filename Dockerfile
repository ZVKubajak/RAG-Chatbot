FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY . .

USER root
RUN chown -R pptruser:pptruser /app

USER pptruser

RUN npm run install
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
