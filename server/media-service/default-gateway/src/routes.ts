import express, { type Request, type Response } from "express";

import {
  getFilesListHandler,
  handleDeleteFile,
  handleDownloadFile,
  handleUploadImage,
  handleUploadVideo,
  handleUploadVideoComplete,
} from "./controllers/fileControllers";
import { uploadVideo, uploadImage } from "./middlewares/multer";
import multer from "multer";
import { uploadPathChunks } from "./constants";
import fs from "fs-extra";
import path from "path";
import {
  createFolderHandler,
  deleteFolderHandler,
  getFoldersListHandler,
  getRootFolderHandler,
} from "./controllers/folderController";

const router = express.Router();

router.use((err: any, _: Request, res: Response, next: any) => {
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
router.get("/folders/:userId", getFoldersListHandler);
router.get("/folders/getRoot/:userId", getRootFolderHandler);
router.get("/files/:folderId", getFilesListHandler);
router.get("/download/:id", handleDownloadFile);
router.post("/folders", createFolderHandler);
router.post("/upload", uploadImage.single("file"), handleUploadImage);
router.post("/uploadVideo", uploadVideo.single("video"), handleUploadVideo);
router.post("/uploadVideoComplete", handleUploadVideoComplete);
router.delete("/files/delete/:id", handleDeleteFile);
router.delete("/folders/delete/:id", deleteFolderHandler);

export default router;
