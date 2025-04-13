import type { Express, Response } from "express";
import express from "express";
import config from "./config/config";

const app: Express = express();

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello From Media service!" });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
