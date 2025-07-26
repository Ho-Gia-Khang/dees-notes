import { Request, Response } from "express";
import { EHttpStatusCode } from "../constants";
import {
  createSession,
  deleteSessions,
  findSessions,
  reIssueTokens,
  updateSession,
} from "../services/sessionService";
import { validatePassword } from "../services/userService";
import { generateTokens } from "../utils";
import IUser from "../models/userModel";
import { verifyJwt } from "../utils/jwt";

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

  const { accessToken, refreshToken } = generateTokens(
    user as IUser,
    session.id
  );

  res.locals.user = user;
  res
    .status(EHttpStatusCode.OK)
    .send({ accessToken, refreshToken, sessionId: session.id });
}

export async function renewSessionHandler(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const { valid } = verifyJwt(refreshToken);

  if (!valid) {
    res.status(EHttpStatusCode.UNAUTHORIZED).send("Invalid refresh token");
    return;
  }

  const newTokens = await reIssueTokens({ refreshToken });

  const userId = res.locals.user.id;

  if (!userId) {
    res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR).send("Cannot find user");
    return;
  }

  if (newTokens) {
    res.status(EHttpStatusCode.OK).send({
      accessToken: newTokens.tokenPairs.accessToken,
      refreshToken: newTokens.tokenPairs.refreshToken,
      sessionId: newTokens.sessionId,
    });
    return;
  }

  res
    .status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
    .send("Could not reissue tokens");
}

export async function getUserSessionsHandler(_: Request, res: Response) {
  const userId = res.locals.user.id;

  const sessions = await findSessions({ userId: userId, valid: true });

  res.status(EHttpStatusCode.OK).send(sessions);
}

export async function deleteSessionHandler(_: Request, res: Response) {
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
