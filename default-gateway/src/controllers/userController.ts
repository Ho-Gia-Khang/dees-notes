import { Request, Response } from "express";
import omit from "lodash/omit";
import { CreateUserInput, ERoles, UserInput } from "../models/userModel";
import { createUser, deleteUser, findUser } from "../services/userService";
import { EHttpStatusCode } from "../constants";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const createUserPayload: Omit<UserInput, "comparePassword"> = {
      ...omit(req.body, "passwordConfirmation"),
      role: (req.body.role as ERoles) ?? ERoles.user,
    };
    const newUser = await createUser(createUserPayload);

    res.locals.user = newUser;

    res.status(EHttpStatusCode.CREATED).send(omit(newUser, "password"));
  } catch (e: any) {
    console.log(e);
    res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserHandler = async () => {};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const user = await findUser(userId);
    if (!user) {
      res.status(EHttpStatusCode.NOT_FOUND).send("User not found");
    }

    await deleteUser(userId);
    res.sendStatus(EHttpStatusCode.OK);
  } catch (e: any) {
    console.error(e);
    res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
