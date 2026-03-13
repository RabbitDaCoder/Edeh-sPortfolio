import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export interface MailJobData {
  type: "contact" | "welcome";
  name?: string;
  email: string;
  subject?: string;
  message?: string;
}

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const mailQueue = new Queue<MailJobData>("mail", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

mailQueue.on("error", (error) => {
  logger.error({ error }, "Mail queue error");
});

mailQueue.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, error }, "Mail job failed");
});

export async function addMailJob(data: MailJobData): Promise<void> {
  await mailQueue.add(`${data.type}-mail`, data, {
    jobId: `${data.type}-${data.email}-${Date.now()}`,
  });
}
