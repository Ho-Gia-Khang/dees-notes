import multer from "multer";
import {
  CHUNK_SIZE_LIMIT_MB,
  FILE_SIZE_LIMIT_MB,
  uploadPath,
  uploadPathChunks,
} from "../constants";
import fs from "fs-extra";
import { Request } from "express";

const uploadVideoStorage = multer.diskStorage({
  destination: async (_, __, cb) => {
    cb(null, uploadPathChunks);
  },
  filename: (_: Request, file, cb) => {
    const baseFileName = file.originalname.replace(/\s+/g, "");

    fs.readdir(uploadPathChunks, (err, files) => {
      if (err) {
        return cb(err, uploadPathChunks);
      }

      // Filter files that match the base filename
      const matchingFiles = files.filter((f) => f.startsWith(baseFileName));

      let chunkNumber = 0;
      if (matchingFiles.length > 0) {
        // Extract the highest chunk number
        const highestChunk = Math.max(
          ...matchingFiles.map((f) => {
            const match = f.match(/\.part_(\d+)$/);
            return match ? parseInt(match[1], 10) : -1;
          })
        );
        chunkNumber = highestChunk + 1;
      }

      const fileName = `${baseFileName}.part_${chunkNumber}`;
      cb(null, fileName);
    });
  },
});

export const uploadVideo = multer({
  storage: uploadVideoStorage,
  limits: { fileSize: CHUNK_SIZE_LIMIT_MB }, // 500MB limit
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype.startsWith("video/") ||
      file.mimetype === "application/octet-stream"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Not a video file. Please upload only videos."));
    }
  },
});

const uploadImageStorage = multer.diskStorage({
  destination: async (_, __, cb) => {
    cb(null, uploadPath);
  },
  filename: (_: Request, file, cb) => {
    const baseFileName = file.originalname.replace(/\s+/g, "");
    const timestamp = Date.now();
    // Create a unique filename with timestamp to avoid collisions
    const fileName = `${timestamp}-${baseFileName}`;
    cb(null, fileName);
  },
});

export const uploadImage = multer({
  storage: uploadImageStorage,
  limits: { fileSize: FILE_SIZE_LIMIT_MB }, // 50MB limit
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/octet-stream"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Not an image file. Please upload only images."));
    }
  },
});
