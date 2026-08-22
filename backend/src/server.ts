import { createApp } from "./app";
import { env } from "./config/env";
import { ensureAdminUser } from "./config/admin";
import { startBackupScheduler, stopBackupScheduler } from "./jobs/backup.job";
import { logger } from "./utils/logger";

const app = createApp();

async function startServer(): Promise<void> {
  try {
    await ensureAdminUser();

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
    });

    startBackupScheduler();
  } catch (error) {
    logger.error({ error }, "Server startup failed");
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  logger.info("Shutting down gracefully");
  stopBackupScheduler();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Shutting down gracefully");
  stopBackupScheduler();
  process.exit(0);
});

startServer();
