import { Request, Response } from "express";

const getAllMessages = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.error("Error fetching all messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
