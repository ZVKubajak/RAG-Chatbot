import { Request, Response } from "express";
import qdrant, { collectionName } from "../../configs/qdrant";
import openai from "../../configs/openai";
import os from "os";
import fs from "fs/promises";
import path from "path";
import extractFile from "../../helpers/extractFile";
import scrapeWebsite from "../../helpers/scrapeSite";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuidv4 } from "uuid";
import { Payload } from "../../schemas/payloadSchema";
import urlSchema from "../../schemas/urlSchema";

export const uploadPointsByFile = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  const { buffer, mimetype, originalname, size } = req.file;

  try {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-"));
    const ext = path.extname(originalname);
    const tempPath = path.join(tempDir, Date.now() + ext);
    await fs.writeFile(tempPath, buffer);

    let content: string;

    try {
      content = await extractFile(tempPath, mimetype);
    } catch (error) {
      console.error("Error parsing file:", error);
      res.status(409).json({ message: "Unsupported file type." });
      return;
    }

    await fs.unlink(tempPath);
    await fs.rm(tempDir, { recursive: true });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      keepSeparator: true,
    });

    const docs = await splitter.createDocuments([content]);
    const points = [];

    for (const doc of docs) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: doc.pageContent,
      });

      const vector = embeddingResponse.data[0].embedding;
      const id = uuidv4();

      const payload: Payload = {
        content: doc.pageContent,
        chars: doc.pageContent.length,
        file: {
          name: originalname,
          type: mimetype,
          size,
        },
      };

      points.push({
        id,
        vector,
        payload,
      });
    }

    const upsertResponse = await qdrant.upsert(collectionName, { points });
    res.status(201).json(upsertResponse);
  } catch (error) {
    console.error("Error uploading points by file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadPointsByWebpage = async (req: Request, res: Response) => {
  const parsedUrl = urlSchema.safeParse(req.body.url);
  if (!parsedUrl.success) {
    res.status(400).json({ message: "Invalid URL." });
    return;
  }

  const { data } = parsedUrl;

  try {
    const { url, content } = await scrapeWebsite(data, true);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      keepSeparator: true,
    });

    const docs = await splitter.createDocuments([content]);
    const points = [];

    for (const doc of docs) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: doc.pageContent,
      });

      const vector = embeddingResponse.data[0].embedding;
      const id = uuidv4();

      const payload: Payload = {
        content: doc.pageContent,
        chars: doc.pageContent.length,
        url,
      };

      points.push({
        id,
        vector,
        payload,
      });
    }

    const upsertResponse = await qdrant.upsert(collectionName, { points });
    res.status(200).json(upsertResponse);
  } catch (error) {
    console.error("Error uploading points by webpage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadPointsByWebsite = async (req: Request, res: Response) => {
  const parsedUrl = urlSchema.safeParse(req.body.url);
  if (!parsedUrl.success) {
    res.status(400).json({ message: "Invalid URL." });
    return;
  }

  const { data } = parsedUrl;

  try {
    const results = await scrapeWebsite(data, false);
    const points = [];

    for (const { url, content } of results) {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        keepSeparator: true,
      });

      const docs = await splitter.createDocuments([content]);

      for (const doc of docs) {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: doc.pageContent,
        });

        const vector = embeddingResponse.data[0].embedding;
        const id = uuidv4();

        const payload: Payload = {
          content: doc.pageContent,
          chars: doc.pageContent.length,
          url,
        };

        points.push({
          id,
          vector,
          payload,
        });
      }
    }

    const upsertResponse = await qdrant.upsert(collectionName, { points });
    res.status(200).json(upsertResponse);
  } catch (error) {
    console.error("Error uploading points by website:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
