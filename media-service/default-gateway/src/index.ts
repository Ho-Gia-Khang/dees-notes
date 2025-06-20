import type { Express, Response } from "express";
import express from "express";
import config from "./config/config";
import mediaRouter from "./routes";

const app: Express = express();

app.use("/", mediaRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
