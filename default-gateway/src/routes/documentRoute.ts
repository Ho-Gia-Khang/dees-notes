import express from "express";
import type { Request, Response } from "express";
import config from "../config/config";

const documentRouter = express.Router();

documentRouter.get("/", async (_, res: Response) => {
  const rp = await fetch(config.URLs.DOCUMENT_SERVICE_URL);
  const message = await rp.json();
  res.status(200).send({ message });
});

export default documentRouter;
