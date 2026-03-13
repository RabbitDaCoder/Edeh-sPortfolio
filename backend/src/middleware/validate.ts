import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { error } from "../utils/apiResponse";
import { ErrorCode } from "../utils/errorCodes";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return error(
        res,
        ErrorCode.VALIDATION_ERROR,
        JSON.stringify(fieldErrors),
      );
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return error(
        res,
        ErrorCode.VALIDATION_ERROR,
        JSON.stringify(fieldErrors),
      );
    }

    req.query = result.data as any;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return error(
        res,
        ErrorCode.VALIDATION_ERROR,
        JSON.stringify(fieldErrors),
      );
    }

    req.params = result.data as any;
    next();
  };
}
