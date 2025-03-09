import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

const jellyfinProxyMiddleWare = createProxyMiddleware<Request, Response>({
  target: "http://jellyfin:8096",
});

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello From Media service!" });
});

app.use("/jellyfin", jellyfinProxyMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
