import express from "express";
import type { Request, Response } from "express";
import config from "../config/config";
import requireUser from "../middlewares/requireUser";

const documentRouter = express.Router();

documentRouter.get("/", requireUser, async (_, res: Response) => {
  const rp = await fetch(config.URLs.DOCUMENT_SERVICE_URL);
  const message = await rp.json();
  res.status(200).send({ message });
});

export default documentRouter;
