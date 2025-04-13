import type { Response } from "express";
import express from "express";
import config from "../config/config";

const mediaRouter = express.Router();

mediaRouter.get("/", async (_, res: Response) => {
  const rp = await fetch(config.URLs.MEDIA_SERVICE_URL);
  const message = await rp.json();
  res.status(200).send({ message });
});

mediaRouter.get("/player", async (_, res: Response) => {
  res.redirect(config.URLs.JELLYFIN_URL);
});

export default mediaRouter;
