# RAG Chatbot

## Description
A retrieval-augmented generation chatbot built on a Qdrant vector database. Users can upload PDF, TXT, CSV, XLS files as well as scrape websites when given a link. Includes rate limiting and session storing.

## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [Questions](#questions)
- [Credits](#credits)

## Usage
Checkout the deployed site at [https://rag-chatbot-production-ffa2.up.railway.app](https://rag-chatbot-production-ffa2.up.railway.app). Currently, only the chatbot is built on backend logic; the rest of the webpage is just for show. Start by uploading files or URLs using the upload modal. Once data has been uploaded, ask the chatbot a question or prompt it about anything related to the uploaded data.

**NOTE:** Uploading data is a demo feature only. Users would not be able to upload data in a production environment as such actions would be reserved for the owner of the chatbot.

We are actively maintaining and improving this demo. We may occasionally clear the vector database to avoid it from becoming cluttered with random data.

## Main Page
![image](https://github.com/user-attachments/assets/b5679c44-cd2a-4203-beb4-9fed62536571)

## Upload Modal
![image](https://github.com/user-attachments/assets/5bc84d17-8b16-49e6-b5df-70a8bb53e6b1)

## Chatbot
![image](https://github.com/user-attachments/assets/fcd377f4-01b7-4bf5-aedc-ec85623c82dd)

## Installation
For the smoothest experience, we recommend setting up a Qdrant cluster, Mongo Atlas cluster, and a Redis database. All of this can be done at no cost.
To start, make a Client entry in a collection on Mongo Atlas. Follow this model:
```
{
  "_id": { "$oid": "686ca35609dc3ba894747c94" },
  "name": "RAG Chatbot Account",
  "tier": "STANDARD",
  "usage": {
    "messages": { "$numberLong": "0" },
    "tokensUsed": { "$numberLong": "0" },
    "storageUsed": { "$numberInt": "0" },
    "lastReset": {
      "$date": { "$numberLong": "1751328000000" }
    }
  },
  "limits": {
    "messageLimit": { "$numberInt": "500" },
    "tokenLimit": { "$numberInt": "100000" },
    "storageLimit": { "$numberInt": "20000000" }
  },
  "Session": [],
  "createdAt": {
    "$date": { "$numberLong": "1751648400000" }
  },
  "updatedAt": {
    "$date": { "$numberLong": "1751948360230" }
  }
}
```

You will need the following ENV variables:
```
REDIS_USERNAME
REDIS_PASSWORD
REDIS_HOST
REDIS_PORT
QDRANT_URL
QDRANT_API_KEY
OPENAI_API_KEY
DATABASE_URL (for Prisma)
CLIENT_ID (ID of Client entry made on Mongo Atlas)
PORT
```

Quickstart:
```
git clone git@github.com:ZVKubajak/RAG-Chatbot.git
cd RAG-Chatbot/
npm i
npm run start:dev
```

Make sure to change out the Axios base URL for `/api` in the client:
```
/client/src/services/api.ts

const api: AxiosInstance = axios.create({
  baseURL: "https://rag-chatbot-production-ffa2.up.railway.app/api", // Change this
  timeout: 60000,
});

=====

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:<YOUR PORT>/api", // To this
  timeout: 60000,
});
```

## Questions
If you have any questions, you can reach out to the team at [zvkubajak@gmail.com](mailto:zvkubajak@gmail.com) and [bryceberczik.dev@gmail.com](mailto:bryceberczik.dev@gmail.com).

## Credits
Created by Zander Kubajak and Bryce Berczik.
- [ZVKubajak](https://github.com/ZVKubajak)
- [bryceberczik](https://github.com/bryceberczik)

© 2025 RAG Chatbot. All rights reserved.
