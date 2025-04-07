import express from "express";
import dotenv from "dotenv";
import type { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3002;

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello from Document service" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
