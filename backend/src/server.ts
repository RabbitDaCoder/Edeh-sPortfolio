import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

// Lazy-load mail worker only when needed — it opens a separate Redis
// connection that counts against Upstash request limits even when idle.
let mailWorker: { close: () => Promise<void> } | null = null;

async function initMailWorker() {
  try {
    const { mailWorker: worker } = await import("./jobs/mail.job");
    mailWorker = worker;
    logger.info("Mail worker initialized");
  } catch (error) {
    logger.warn({ error }, "Mail worker failed to start — mail jobs disabled");
  }
}

const app = createApp();

async function startServer(): Promise<void> {
  try {
    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
    });
    await initMailWorker();
  } catch (error) {
    logger.error({ error }, "Server startup failed");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully");
  await mailWorker?.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down gracefully");
  await mailWorker?.close();
  process.exit(0);
});

startServer();
