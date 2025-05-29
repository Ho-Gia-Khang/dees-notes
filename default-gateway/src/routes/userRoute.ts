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
  deleteCurrentUserHandler,
  deleteUser,
  getCurrentUser,
  getUsersList,
  updateUserHandler,
} from "../controllers/userController";

const userRouter = express.Router();

// static routes
userRouter.get("/current", requireUser, getCurrentUser);
userRouter.get("/usersList", requireUser, getUsersList);
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
userRouter.put("/update", requireUser, updateUserHandler);
userRouter.delete("/logout", requireUser, deleteSessionHandler);
userRouter.delete("/deleteCurrent", requireUser, deleteCurrentUserHandler);

// dynamic routes
userRouter.delete("/delete/:phoneNumber", requireUser, deleteUser);

export default userRouter;
