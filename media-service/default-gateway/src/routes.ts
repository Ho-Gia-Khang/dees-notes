import express from "express";

import {
  getDocumentsList,
  handleDeleteFile,
  handleDownloadFile,
  handleUpload,
} from "./controllers";
import fileUpload from "express-fileupload";
import { filesPayloadExists } from "./middlewares/filesPayloadExists";
import { fileSizeLimiter } from "./middlewares/fileSizeLimiter";
import { fileExtLimiter } from "./middlewares/fileExtLimiter";

const router = express.Router();

router.get("/:userId", getDocumentsList);
router.get("/download/:id", handleDownloadFile);
router.post(
  "/upload",
  [
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileSizeLimiter,
    fileExtLimiter,
  ],
  handleUpload
);
router.delete("/delete/:id", handleDeleteFile);

export default router;
