import { Request, Response, NextFunction } from "express";
import redis from "../configs/redis";

const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;

  try {
    if (!ip) throw new Error("IP not found.");
    const key = `rate-limit:${ip}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 3600);
    } else if (count >= 20) {
      res.status(429).json({ message: "Message limit reached." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error enforcing rate limit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default rateLimit;
