import cors from "cors";
import type { Express, Response } from "express";
import express from "express";
import config from "./config/config";

import mediaRouter from "./routes/mediaRoute";
import documentRouter from "./routes/documentRoute";
import userRouter from "./routes/userRoute";
import { deserializeUser } from "./middlewares/deserializeUser";
import { checkUsersStatus } from "./middlewares/checkUsersStatus";

const app: Express = express();

app.use(cors(config.corsOptions));
app.use(express.json());
app.use(checkUsersStatus);
app.use(deserializeUser);

app.get("/", (_, res: Response) => {
  res.status(200).send({ message: "Hello from Default gateway" });
});

app.use("/media", mediaRouter);
app.use("/document", documentRouter);
app.use("/auth", userRouter);

app.listen(config.port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${config.port} `
  );
});
