import cors from "cors";
import type { Express, Response } from "express";
import express from "express";
import config from "./config/config";

const app: Express = express();

app.use(cors(config.corsOptions));

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello from Default gateway" });
});

app.get("/media", async (_, res: Response) => {
  const rp = await fetch(config.URLs.MEDIA_SERVICE_URL);
  const message = await rp.json();
  res.status(200).send({ message });
});

app.listen(config.port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${config.port} `
  );
});
