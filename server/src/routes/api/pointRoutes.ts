import { Router } from "express";
import upload from "../../configs/upload";
import {
  getAllPoints,
  getPointById,
  uploadPointsByFile,
  uploadPointsByWebpage,
  uploadPointsByWebsite,
} from "../../controllers/api/pointController";

const router = Router();

// Get all points
router.get("/", getAllPoints);

// Get point by ID.
router.get("/:id", getPointById);

// Upload point via file.
router.post("/file", upload.single("file"), uploadPointsByFile);

// Upload points via webpage.
router.post("/webpage", uploadPointsByWebpage);

// Upload points via website.
router.post("/website", uploadPointsByWebsite);

export { router as pointRouter };
