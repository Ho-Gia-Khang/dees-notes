import { NextFunction, Request, Response } from "express";

export const filesPayloadExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    res.status(400).send({
      status: "error",
      message: "No files were uploaded.",
    });
  }
  next();
};
