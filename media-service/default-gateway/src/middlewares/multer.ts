import multer from "multer";
import { CHUNK_SIZE_LIMIT_MB, uploadPathChunks } from "../constants";
import fs from "fs-extra";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    // Ensure the upload directory exists
    await fs.mkdir(uploadPathChunks, { recursive: true });
    cb(null, uploadPathChunks);
  },
  filename: (req: Request, file, cb) => {
    console.log(" req:", req.files);
    console.log(" file:", file);
    const baseFileName = file.originalname.replace(/\s+/g, "");
    console.log(" baseFileName:", baseFileName);

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

export const upload = multer({
  storage: storage,
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
