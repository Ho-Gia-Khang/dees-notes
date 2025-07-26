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
userRouter.get("/current", [express.json(), requireUser], getCurrentUser);
userRouter.get("/usersList", [express.json(), requireUser], getUsersList);
userRouter.post(
  "/create",
  [express.json(), validate(createUserSchema)],
  createUserHandler
);
userRouter.post(
  "/login",
  [express.json(), validate(createSessionSchema)],
  createUserSessionHandler
);
userRouter.post(
  "/loginSilent",
  [express.json(), validate(renewSessionSchema)],
  renewSessionHandler
);
userRouter.put("/update", [express.json(), requireUser], updateUserHandler);
userRouter.delete("/logout", express.json(), deleteSessionHandler);
userRouter.delete(
  "/deleteCurrent",
  [express.json(), requireUser],
  deleteCurrentUserHandler
);

// dynamic routes
userRouter.delete(
  "/delete/:phoneNumber",
  [express.json(), requireUser],
  deleteUser
);

export default userRouter;
