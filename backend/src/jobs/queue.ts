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

export async function addMailJob(data: MailJobData): Promise<void> {
  const name: string = `${data.type}-mail`;
  await mailQueue.add(name as keyof MailJobData, data, {
    jobId: `${data.type}-${data.email}-${Date.now()}`,
  });
}
