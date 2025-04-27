import { Request, Response } from "express";
import { validatePassword } from "../services/userService";
import {
  createSession,
  deleteSessions,
  findSessions,
  updateSession,
} from "../services/sessionService";
import { signJwt } from "../utils/jwt";
import { EHttpStatusCode } from "../constants";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user password
  const user = await validatePassword({
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  });

  if (!user) {
    res
      .status(EHttpStatusCode.NOT_ACCEPTABLE)
      .send("Invalid email or password");

    return;
  }

  //create a session
  const session = await createSession({ userId: user.id });

  //create an access token
  const accessToken = signJwt(
    { ...user, session: session.id },
    { expiresIn: "15m" }
  );

  //create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session.id },
    { expiresIn: "90d" }
  );

  res.locals.user = user;
  res.status(EHttpStatusCode.OK).send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;

  const sessions = await findSessions({ userId: userId, valid: true });

  res.status(EHttpStatusCode.OK).send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;

  const sessions = await updateSession({ query: userId, update: false });

  if (sessions) {
    await deleteSessions({ userId: userId, valid: false });
  }

  res.status(EHttpStatusCode.OK).send({
    accessToken: null,
    refreshToken: null,
  });
}
