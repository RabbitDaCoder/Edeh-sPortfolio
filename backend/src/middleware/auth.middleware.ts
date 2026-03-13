import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { error } from "../utils/apiResponse";
import { ErrorCode } from "../utils/errorCodes";
import { env } from "../config/env";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, ErrorCode.UNAUTHORIZED) as any;
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return error(res, ErrorCode.TOKEN_EXPIRED) as any;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return error(res, ErrorCode.INVALID_TOKEN) as any;
    }
    return error(res, ErrorCode.UNAUTHORIZED) as any;
  }
}
