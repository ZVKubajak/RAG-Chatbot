import { Request, Response, NextFunction } from "express";

const apiKey = process.env.API_KEY!;

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "").trim();

    if (token !== apiKey) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error authenticating request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default authenticate;
