import { Request, Response, NextFunction } from "express";
import get from "lodash/get";
import { verifyJwt } from "../utils/jwt";
import { reIssueTokens } from "../services/sessionService";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x_refresh") as string;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const tokensPairs = await reIssueTokens({ refreshToken });

    if (tokensPairs) {
      res.setHeader("x-access-token", tokensPairs.accessToken);
      const { decoded } = verifyJwt(tokensPairs.accessToken as string);
      res.locals.user = decoded;
    }

    return next();
  }

  return next();
};
