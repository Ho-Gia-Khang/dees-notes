import express, { NextFunction, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
} from "../controllers/sessionController";

import requireUser from "../middlewares/requireUser";
import validate from "../middlewares/validateRequests";
import { createUserSchema } from "../models/userModel";
import { createSessionSchema } from "../models/sessionModel";
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

// dynamic routes
userRouter.delete("/logout", requireUser, deleteSessionHandler);
userRouter.delete("/delete", requireUser, deleteUserHandler);

export default userRouter;
