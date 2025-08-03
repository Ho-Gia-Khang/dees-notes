import express from "express";

import {
  getDocumentsListHandler,
  handleDeleteFile,
  handleDownloadFile,
  handleUpload,
} from "./controllers/fileControllers";
import fileUpload from "express-fileupload";
import { filesPayloadExists } from "./middlewares/filesPayloadExists";
import { fileSizeLimiter } from "./middlewares/fileSizeLimiter";
import { fileExtLimiter } from "./middlewares/fileExtLimiter";
import {
  createFolderHandler,
  deleteFolderHandler,
  getFoldersListHandler,
  getRootFolderHandler,
} from "./controllers/folderControllers";

const router = express.Router();

router.get("/folders/:userId", getFoldersListHandler);
router.get("/folders/getRoot/:userId", getRootFolderHandler);
router.get("/files/:folderId", getDocumentsListHandler);
router.get("/download/:id", handleDownloadFile);
router.post("/folders", createFolderHandler);
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
router.delete("/folders/delete/:id", deleteFolderHandler);
router.delete("/files/delete/:id", handleDeleteFile);

export default router;
