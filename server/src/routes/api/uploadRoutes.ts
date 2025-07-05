import { Router } from "express";
import upload from "../../configs/upload";
import {
  uploadFile,
  uploadWebpage,
  uploadWebsite,
} from "../../controllers/api/uploadController";

const router = Router();

// Create vector points via file upload.
router.post("/file", upload.single("file"), uploadFile);

// Create vector points via webpage upload.
router.post("/webpage", uploadWebpage);

// Create vector points via website upload.
router.post("/website", uploadWebsite);

export { router as pointRouter };
