import { Router } from "express";
import { uploadRouter } from "./uploadRoutes";
import usageLimit from "../../middlewares/usageLimit";

const router = Router();

router.use("/uploads", usageLimit, uploadRouter);

export default router;
