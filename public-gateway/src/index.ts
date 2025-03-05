import express from "express";
import dotenv from "dotenv";
import type { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (_, res: Response) => {
  res.send("Hello from Public Gateway");
});

app.get("/document", async (_, res: Response) => {
  const rp = await fetch("http://document:3001");
  const data = await rp.json();
  console.log(" data:", data);
  res.status(200).send(data.message);
});

app.get("/media", async (_, res: Response) => {
  const rp = await fetch("http://media:3000");
  const data = await rp.json();
  console.log(" data:", data);
  res.status(200).send(data.message);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
