import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

const MB = 10; // 10 MB
const FILE_SIZE_LIMIT_MB = MB * 1024 * 1024; // Convert MB to bytes

export const fileSizeLimiter = (
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

  const filesOverLimit: string[] = [];
  Object.keys(files).forEach((key) => {
    const file = files[key] as UploadedFile;
    if (file.size > FILE_SIZE_LIMIT_MB) {
      filesOverLimit.push(key);
    }
  });

  if (filesOverLimit.length) {
    res.status(413).send({ message: "File size too large", filesOverLimit });
  }

  next();
};
