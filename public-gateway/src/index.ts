import express from "express";
import dotenv from "dotenv";
import type { Express, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const mediaProxyMiddleWare = createProxyMiddleware<Request, Response>({
  target: "http://media:3000",
  changeOrigin: true,
  pathRewrite: {
    "^/media": "", // Remove "/media" prefix when forwarding requests to make /media become the root of media service
  },
});

app.get("/", (_, res: Response) => {
  res.send("Hello from Public Gateway");
});

app.get("/document", async (_, res: Response) => {
  const rp = await fetch("http://document:3001");
  const data = await rp.json();
  res.status(200).send(data.message);
});

app.use("/media", mediaProxyMiddleWare);

app.get("/media/jellyfin", async (_, res: Response) => {
  // res.redirect("http://jellyfin:8096");
  express.static("http://jellyfin:8096");
  return;
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
