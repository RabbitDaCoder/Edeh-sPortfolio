import { Worker, Job } from "bullmq";
import { env } from "../config/env";
import { mailService } from "../services/mail.service";
import { logger } from "../utils/logger";
import { MailJobData } from "./queue";

export const mailWorker = new Worker<MailJobData>(
  "mail",
  async (job: Job<MailJobData>) => {
    logger.info({ jobId: job.id, type: job.data.type }, "Processing mail job");

    try {
      if (job.data.type === "contact") {
        await mailService.sendContactEmail(
          job.data.name!,
          job.data.email,
          job.data.subject!,
          job.data.message!,
        );
      } else if (job.data.type === "welcome") {
        await mailService.sendWelcomeEmail(job.data.email);
      }

      logger.info({ jobId: job.id }, "Mail job completed");
    } catch (error) {
      logger.error({ jobId: job.id, error }, "Mail job failed");
      throw error;
    }
  },
  {
    connection: { url: env.REDIS_URL },
    concurrency: 5,
  },
);

mailWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, error }, "Mail worker failed");
});

mailWorker.on("error", (error) => {
  logger.error({ error }, "Mail worker error");
});
