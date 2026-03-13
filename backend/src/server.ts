import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { mailWorker } from "./jobs/mail.job";

const app = createApp();

async function startServer(): Promise<void> {
  try {
    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
    });
  } catch (error) {
    logger.error({ error }, "Server startup failed");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully");
  await mailWorker.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down gracefully");
  await mailWorker.close();
  process.exit(0);
});

startServer();
