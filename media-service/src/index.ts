import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello From Media service!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
