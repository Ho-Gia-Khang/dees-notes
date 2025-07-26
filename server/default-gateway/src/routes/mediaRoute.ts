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
const mediaServiceProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: config.URLs.MEDIA_SERVICE_URL,
  changeOrigin: true,
  on: {
    error: (err) => {
      console.error("Proxy error:", err.message);
    },
  },
  ws: true,
});

mediaRouter.use("/", requireUser, mediaServiceProxyMiddleware);
mediaRouter.use("/upload", requireUser, mediaServiceProxyMiddleware);
mediaRouter.use("/uploadVideo", requireUser, mediaServiceProxyMiddleware);
mediaRouter.use(
  "/uploadVideoComplete",
  requireUser,
  mediaServiceProxyMiddleware
);
mediaRouter.use("/delete/:id", requireUser, mediaServiceProxyMiddleware);

mediaRouter.get(
  "/player",
  [express.json(), requireUser],
  (_: Request, res: Response) => {
    res.status(200).send({
      url: `${config.URLs.ORIGIN}/media/player/jellyfin/`,
    });
  }
);
mediaRouter.use("/player/jellyfin", requireUser, jellyfinProxyMiddleware);

export default mediaRouter;
