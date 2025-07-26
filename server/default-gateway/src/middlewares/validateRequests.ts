import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { EHttpStatusCode } from "../constants";

const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res.status(EHttpStatusCode.BAD_REQUEST).send(error.errors);
    }
  };

export default validate;
