import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { swaggerSpec } from "./docs/swagger";
import v1Routes from "./routes/v1";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg) } }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(generalLimiter);

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/v1", v1Routes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  app.use(errorHandler);

  return app;
}
