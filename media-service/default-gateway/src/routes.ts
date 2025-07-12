import express, { Request } from "express";

import {
  getFilesList,
  handleDeleteFile,
  handleDownloadFile,
  handleUploadImage,
  handleUploadVideo,
  handleUploadVideoComplete,
} from "./controllers";
import { uploadVideo, uploadImage } from "./middlewares/multer";
import multer from "multer";
import { uploadPathChunks } from "./constants";
import fs from "fs-extra";
import path from "path";

const router = express.Router();

router.use((err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    console.log("Multer error:", err.message);
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    fs.readdir(uploadPathChunks, (err, files) => {
      if (err) {
        return console.error("Unable to scan directory: " + err);
      }

      // Iterate over the files and delete each one
      files.forEach((file) => {
        const filePath = path.join(uploadPathChunks, file);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", filePath, err);
          } else {
            console.log("Successfully deleted file:", filePath);
          }
        });
      });
    });
    console.log("General error:", err.message);
    return res.status(500).json({ error: err.message });
  }
  next();
});
router.get("/:userId", getFilesList);
router.get("/download/:id", handleDownloadFile);
router.post("/upload", uploadImage.single("file"), handleUploadImage);
router.post("/uploadVideo", uploadVideo.single("video"), handleUploadVideo);
router.post("/uploadVideoComplete", handleUploadVideoComplete);
router.delete("/delete/:id", handleDeleteFile);

export default router;
