import type { Express } from "express";
import express from "express";
import config from "./config/config";
import mediaRouter from "./routes";
import { uploadPath, uploadPathChunks } from "./constants";
import fs from "fs-extra";

const app: Express = express();

app.use(express.json());

app.use("/", mediaRouter);

app.listen(config.PORT, async () => {
  // ensure the upload directories exist
  await fs.mkdir(uploadPath, { recursive: true });
  await fs.mkdir(uploadPathChunks, { recursive: true });
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
