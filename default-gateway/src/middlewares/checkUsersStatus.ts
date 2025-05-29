import { NextFunction, Request, Response } from "express";
import { ERoles, UserInput } from "../models/userModel";
import { createUser, hasAdmin } from "../services/userService";

export const checkUsersStatus = async (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  const hasUsers = await hasAdmin();

  if (!hasUsers) {
    const defaultUser: Omit<UserInput, "comparePassword"> = {
      phoneNumber: "0123456789",
      password: "changeMe",
      role: ERoles.admin,
    };
    await createUser(defaultUser);
  }

  return next();
};
