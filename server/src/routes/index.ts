import { Router } from "express";
import apiRoutes from "./api/index";
import chat from "../controllers/chat";

const router = Router();

router.use("/api", apiRoutes);
router.post("/chat", chat);

export default router;
