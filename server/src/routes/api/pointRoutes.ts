import { Router } from "express";
import upload from "../../config/upload";
import {
  getAllPoints,
  getPointById,
  uploadPointsByFile,
  uploadPointsByWebsite,
} from "../../controllers/pointController";

const router = Router();

// Get all points
router.get("/", getAllPoints);

// Get point by ID.
router.get("/:id", getPointById);

// Upload point via file.
router.post("/file", upload.single("file"), uploadPointsByFile);

// Upload points via website.
router.post("/website", uploadPointsByWebsite);

export { router as pointRouter };
