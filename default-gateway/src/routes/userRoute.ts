import express from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  renewSessionHandler,
} from "../controllers/sessionController";

import requireUser from "../middlewares/requireUser";
import validate from "../middlewares/validateRequests";
import { createUserSchema } from "../models/userModel";
import {
  createSessionSchema,
  renewSessionSchema,
} from "../models/sessionModel";
import {
  createUserHandler,
  deleteUserHandler,
} from "../controllers/userController";

const userRouter = express.Router();

// static routes
userRouter.post("/create", validate(createUserSchema), createUserHandler);
userRouter.post(
  "/login",
  validate(createSessionSchema),
  createUserSessionHandler
);
userRouter.post(
  "/loginSilent",
  validate(renewSessionSchema),
  renewSessionHandler
);

// dynamic routes
userRouter.delete("/logout", requireUser, deleteSessionHandler);
userRouter.delete("/delete", requireUser, deleteUserHandler);

export default userRouter;
