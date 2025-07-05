import { Router } from "express";
import { pointRouter } from "./uploadRoutes";

const router = Router();

router.use("/points", pointRouter);

export default router;
