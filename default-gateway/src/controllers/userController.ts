import bcrypt from "bcrypt";
import { Request, Response } from "express";
import omit from "lodash/omit";
import { EHttpStatusCode } from "../constants";
import {
  CreateUserInput,
  ERoles,
  UpdateUserInput,
  UserInput,
} from "../models/userModel";
import { deleteSessions, updateSession } from "../services/sessionService";
import {
  createUser,
  deleteUserById,
  findUser,
  findUserByPhoneNumber,
  getAllUsers,
  updateUser,
} from "../services/userService";
import { deleteSessionHandler } from "./sessionController";

function isAdmin(_: Request, res: Response): boolean {
  const user = res.locals.user;
  return user && user.role === ERoles.admin;
}

export function getCurrentUser(_: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(EHttpStatusCode.NOT_FOUND).send("User not found");
      return;
    }
    res.status(EHttpStatusCode.OK).send(omit(user, "password"));
  } catch (e: any) {
    console.error(e);
    res
      .status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("Error fetching user");
  }
}

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    if (!isAdmin(req, res)) {
      res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .send("Only admin can create users");
      return;
    }
    const createUserPayload: Omit<UserInput, "comparePassword"> = {
      ...omit(req.body, "passwordConfirmation"),
      role: ERoles.user,
    };

    const newUser = await createUser({
      phoneNumber: createUserPayload.phoneNumber,
      password: createUserPayload.password,
      role: createUserPayload.role,
    });

    res.locals.user = newUser;

    res.status(EHttpStatusCode.CREATED).send(omit(newUser, "password"));
  } catch (e: any) {
    console.log(e);
    res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserHandler = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(EHttpStatusCode.NOT_FOUND).send("User not found");
      return;
    }

    const updateUserPayload = {
      id: user.id,
      role: user.role as ERoles, // Keep the existing role
      phoneNumber: user.phoneNumber, // Keep the existing phone number
      password: user.password, // Keep the existing password
    };

    if (req.body.phoneNumber) {
      updateUserPayload.phoneNumber = req.body.phoneNumber;
    }

    if (req.body.password) {
      updateUserPayload.password = await bcrypt.hash(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
    }

    await updateUser(updateUserPayload);
  } catch (e: any) {
    console.error(e);
    res
      .status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("Error updating user");
  }
};

export const deleteCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const user = await findUser(userId);
    if (!user) {
      res.status(EHttpStatusCode.NOT_FOUND).send("User not found");
    }

    await deleteUserById(userId);
    await deleteSessionHandler(req, res);
    res.sendStatus(EHttpStatusCode.OK);
  } catch (e: any) {
    console.error(e);
    res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req, res)) {
      res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .send("Only admin can create users");
      return;
    }

    const phoneNumber = req.params.phoneNumber;
    const user = await findUserByPhoneNumber(phoneNumber);
    if (!user) {
      res.status(EHttpStatusCode.NOT_FOUND).send("User not found");
      return;
    }
    await deleteUserById(user.id);

    const sessions = await updateSession({ query: user.id, update: false });
    if (sessions) {
      await deleteSessions({ userId: user.id, valid: false });
    }

    res.sendStatus(EHttpStatusCode.OK);
  } catch (e: any) {
    console.error(e);
    res
      .status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("Error deleting user");
  }
};

export async function getUsersList(req: Request, res: Response) {
  try {
    if (!isAdmin(req, res)) {
      res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .send("Only admin can view users list");
      return;
    }

    const usersList = await getAllUsers();

    res.status(200).send({
      items: usersList,
      total: usersList.length,
    });
  } catch (e: any) {
    console.error(e);
    res
      .status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("Error fetching users");
  }
}
