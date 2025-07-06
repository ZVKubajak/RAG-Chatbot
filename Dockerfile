FROM node:22

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN apt-get update -y && apt-get install -y \
  openssl \
  libnspr4 \
  libnss3 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  libgbm1 \
  libasound2 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libexpat1 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  && rm -rf /var/lib/apt/lists/*

RUN npm run install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
