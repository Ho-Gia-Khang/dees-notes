import { Request, Response } from "express";

export async function getDocumentsList(req: Request, res: Response) {
  res.status(200).send({ message: "hello from document service" });
}
