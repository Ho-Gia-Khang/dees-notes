import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello From Home server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
