import { Request, Response, NextFunction } from "express";
import { error } from "../utils/apiResponse";
import { ErrorCode } from "../utils/errorCodes";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message?: string,
    public statusCode?: number,
  ) {
    super(message || ErrorCode[code]);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error({ err }, "Request failed");

  if (err instanceof AppError) {
    error(res, err.code, err.message, err.statusCode);
    return;
  }

  error(res, ErrorCode.INTERNAL_ERROR);
}
