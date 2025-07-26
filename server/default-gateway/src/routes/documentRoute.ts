import express from "express";
import type { Request, Response } from "express";
import config from "../config/config";
import requireUser from "../middlewares/requireUser";
import { createProxyMiddleware } from "http-proxy-middleware";

const documentRouter = express.Router();

const documentServiceProxyMiddleware = createProxyMiddleware<Request, Response>(
  {
    target: config.URLs.DOCUMENT_SERVICE_URL,
    changeOrigin: true,
    on: {
      error: (err) => {
        console.error("Proxy error:", err.message);
      },
    },
    ws: true,
  }
);

documentRouter.use("/", requireUser, documentServiceProxyMiddleware);
documentRouter.use("/upload", requireUser, documentServiceProxyMiddleware);
documentRouter.use(
  "/delete/:documentId",
  requireUser,
  documentServiceProxyMiddleware
);

export default documentRouter;
