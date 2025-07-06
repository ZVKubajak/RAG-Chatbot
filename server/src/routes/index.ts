import { Router } from "express";
import apiRoutes from "./api/index";
import chat from "../controllers/chat";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.use(
  "/api",
  // authenticate,
  apiRoutes
);
router.post("/chat", chat);

export default router;
