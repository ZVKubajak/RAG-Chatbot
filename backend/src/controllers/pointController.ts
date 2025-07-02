import { Request, Response } from "express";
import qdrant, { collectionName } from "../config/qdrant";
import openai from "../config/openai";
import extractTextFromFile from "../helpers/fileHelper";
import os from "os";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
      allPoints.push(points);
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
  const { id } = req.params;

  if (!id) {
    res.status(404).json({ message: "No ID provided." });
    return;
  }

  try {
    const points = await qdrant.retrieve(collectionName, {
      ids: [id],
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
    const ext = path.extname(originalname) || "";
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
    await fs.rmdir(tempDir, { recursive: true });

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const vector = embeddingResponse.data[0].embedding;
    const id = uuidv4();

    const point = await qdrant.upsert(collectionName, {
      points: [
        {
          id,
          vector,
          payload: {
            name: originalname,
            content: content,
            mimetype: mimetype,
            size: size,
          },
        },
      ],
    });

    res.status(201).json(point);
  } catch (error) {
    console.error("Error uploading point:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
