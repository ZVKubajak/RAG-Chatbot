import { Router } from "express";
import upload from "../../config/upload";
import {
  getAllPoints,
  getPointById,
  uploadPoint,
} from "../../controllers/pointController";

const router = Router();

// Get all points
router.get("/", getAllPoints);

// Get point by ID.
router.get("/:id", getPointById);

// Upload point
router.post("/", upload.single("file"), uploadPoint);

export { router as pointRouter };
