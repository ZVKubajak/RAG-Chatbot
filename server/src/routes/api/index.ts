import { Router } from "express";
import { pointRouter } from "./pointRoutes";

const router = Router();

router.use("/points", pointRouter);

export default router;
