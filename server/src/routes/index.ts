import { Router } from "express";
import apiRoutes from "./api/index";
import chat from "../controllers/chat";
import authenticate from "../middlewares/authenticate";
import rateLimit from "../middlewares/rateLimit";

const router = Router();

router.use(
  "/api",
  // authenticate,
  apiRoutes
);
router.post("/chat", rateLimit, chat);

export default router;
