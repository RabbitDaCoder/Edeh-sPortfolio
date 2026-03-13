import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { error } from "../utils/apiResponse";
import { ErrorCode } from "../utils/errorCodes";
import { logger } from "../utils/logger";

const IDEMPOTENCY_KEY_PREFIX = "idempotency:";
const DEFAULT_TTL = 30;

export function idempotencyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const idempotencyKey = req.headers["idempotency-key"] as string;

  if (!idempotencyKey) {
    next();
    return;
  }

  const key = `${IDEMPOTENCY_KEY_PREFIX}${idempotencyKey}`;

  redis
    .get(key)
    .then((cached) => {
      if (cached) {
        logger.info({ idempotencyKey }, "Idempotent request detected");
        return error(res, ErrorCode.DUPLICATE_REQUEST) as any;
      }

      redis.setex(key, DEFAULT_TTL, "1").catch((err) => {
        logger.error({ err, key }, "Failed to set idempotency key");
      });

      next();
    })
    .catch((err) => {
      logger.error({ err }, "Idempotency middleware error");
      next();
    });
}
