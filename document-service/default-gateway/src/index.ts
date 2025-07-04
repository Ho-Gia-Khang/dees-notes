import dotenv from "dotenv";
import type { Express } from "express";
import express from "express";
import documentRouter from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3002;

app.use("/", documentRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
