import { Request, Response, NextFunction } from "express";
import { EHttpStatusCode } from "../constants";

const requireUser = (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    res.sendStatus(EHttpStatusCode.UNAUTHORIZED);
  }

  next();
};

export default requireUser;
