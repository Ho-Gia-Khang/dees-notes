import { type NextFunction, type Request, type Response } from "express";
import { checkRootFolder, createFolder } from "../services/folderServices";
import { IApiError, IFolderInput } from "@dees-notes/shared-module/dist/types";
import { ROOT_FOLDER_ID } from "../constants";

export const checkRootFolderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasRootFolder = await checkRootFolder();

  if (!hasRootFolder) {
    const paths = req.path.split("/");

    const userId = (req.body?.userId ||
      req.query?.userId ||
      req.params?.userId ||
      paths[paths.length - 1]) as string;

    if (!userId) {
      const errMsg: IApiError = {
        message: {
          userId: "User ID is required.",
        },
      };
      res.status(400).send(errMsg);
      return;
    }

    const rootFolder: IFolderInput = {
      name: "root",
      userId,
      id: ROOT_FOLDER_ID,
    };
    await createFolder(rootFolder);
  }

  return next();
};
