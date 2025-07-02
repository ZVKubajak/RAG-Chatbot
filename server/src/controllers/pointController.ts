import { Request, Response } from "express";
import qdrant, { collectionName } from "../config/qdrant";
import openai from "../config/openai";
import extractTextFromFile from "../helpers/fileHelper";
import os from "os";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Payload } from "../schema/payloadSchema";
import { idSchema } from "../schema/idSchema";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const getAllPoints = async (_req: Request, res: Response) => {
  try {
    const allPoints = [];
    let hasMore = true;
    let offset;

    while (hasMore) {
      const { points, next_page_offset } = await qdrant.scroll(collectionName, {
        limit: 1000,
        with_payload: true,
        with_vector: true,
      });

      offset = next_page_offset;
      hasMore = !!offset;
      allPoints.push(...points);
    }

    if (allPoints.length === 0) {
      res.status(404).json({ message: "No datasets found." });
      return;
    }

    res.status(200).json({ count: allPoints.length, points: allPoints });
  } catch (error) {
    console.error("Error fetching all points:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPointById = async (req: Request, res: Response) => {
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    res.status(400).json({ message: "Request Parsing Error" });
    return;
  }

  try {
    const points = await qdrant.retrieve(collectionName, {
      ids: [parsedId.data],
      with_payload: true,
      with_vector: true,
    });

    if (points.length === 0) {
      res.status(404).json({ message: "Point not found." });
      return;
    }

    res.status(200).json(points[0]);
  } catch (error) {
    console.error("Error fetching point by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadPoint = async (req: Request, res: Response) => {
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
      content = await extractTextFromFile(tempPath, mimetype);
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
        family: {
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
    console.error("Error uploading point:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
