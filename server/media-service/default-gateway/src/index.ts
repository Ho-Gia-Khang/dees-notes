import type { Express } from "express";
import express from "express";
import fs from "fs-extra";
import config from "./config/config";
import { uploadPath, uploadPathChunks } from "./constants";
import { checkRootFolderStatus } from "./middlewares/checkRootFolder";
import mediaRouter from "./routes";

const app: Express = express();

app.use(express.json());
app.use(checkRootFolderStatus);

app.use("/", mediaRouter);

app.listen(config.PORT, async () => {
  // ensure the upload directories exist
  await fs.mkdir(uploadPath, { recursive: true });
  await fs.mkdir(uploadPathChunks, { recursive: true });
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
