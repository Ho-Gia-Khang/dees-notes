import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

import { ALLOWED_FILE_TYPES } from "../constants";

export const fileExtLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files;

  // just to deal with ts error, should not reach this block if filesPayloadExists middleware is used
  if (!files) {
    next();
    return;
  }

  const fileExts: string[] = [];
  Object.keys(files).forEach((key) => {
    const file = files[key] as UploadedFile;
    const ext = path.extname(file.name).toLowerCase();
    fileExts.push(ext);
  });

  const allowed = fileExts.every((ext) => ALLOWED_FILE_TYPES.includes(ext));

  if (!allowed) {
    res.status(422).send({
      message: "Unsupported extension.",
      error: "Unprocessable Entity.",
      ALLOWED_FILE_TYPES,
      receivedExtensions: fileExts,
    });
  }

  next();
};
