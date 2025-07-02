import { Router } from "express";
import { pointRouter } from "./pointRoutes";
import { aiRouter } from "./aiRoutes";

const router = Router();

router.use("/points", pointRouter);
router.use("/ai", aiRouter);

export default router;
