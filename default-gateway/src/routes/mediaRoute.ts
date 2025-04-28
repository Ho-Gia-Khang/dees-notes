import type { Response, Request } from "express";
import express from "express";
import config from "../config/config";
import { createProxyMiddleware } from "http-proxy-middleware";
import requireUser from "../middlewares/requireUser";

const mediaRouter = express.Router();

const jellyfinProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: config.URLs.JELLYFIN_URL,
  changeOrigin: true,
  on: {
    error: (err) => {
      console.error("Proxy error:", err.message);
    },
  },
  ws: true,
});

mediaRouter.get("/", requireUser, async (_, res: Response) => {
  const rp = await fetch(config.URLs.MEDIA_SERVICE_URL);
  const message = await rp.json();
  res.status(200).send(message);
});

mediaRouter.get("/player", requireUser, (_, res: Response) => {
  // some authentication logic here
  res.status(200).send({
    url: `${config.URLs.ORIGIN}/media/player/jellyfin/`,
  });
});
mediaRouter.use("/player/jellyfin", requireUser, jellyfinProxyMiddleware);

export default mediaRouter;
