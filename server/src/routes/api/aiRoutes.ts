import { Router } from "express";
import { chat } from "../../controllers/aiController";

const router = Router();

router.post("/", chat);

export { router as aiRouter };
