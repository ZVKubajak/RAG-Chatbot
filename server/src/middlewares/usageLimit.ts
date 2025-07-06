import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const clientId = process.env.CLIENT_ID;
const prisma = new PrismaClient();

const usageLimit = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      res.status(404).json({ message: "Client not found." });
      return;
    }

    const { usage, limits } = client;
    if (usage.storageUsed >= limits.storageLimit) {
      res.status(403).json({ message: "Storage limit reached." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error enforcing usage limit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default usageLimit;
