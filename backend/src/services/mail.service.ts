import { env } from "../config/env";
import { logger } from "../utils/logger";

interface ProposalData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

async function callEmailService(
  payload: Record<string, unknown>,
): Promise<void> {
  const url = `${env.EMAIL_SERVICE_URL}/api/send`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.EMAIL_SERVICE_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email service responded ${res.status}: ${body}`);
  }

  const data = await res.json();
  logger.info({ messageId: data.messageId }, "Email sent via email-service");
}

export class MailService {
  async sendProposalEmail(data: ProposalData): Promise<void> {
    await callEmailService({
      type: "proposal",
      name: data.name,
      email: data.email,
      company: data.company,
      projectType: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
      message: data.message,
    });
  }

  async sendContactEmail(
    name: string,
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.sendProposalEmail({ name, email, message });
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    await callEmailService({
      type: "welcome",
      email,
    });
  }
}

export const mailService = new MailService();
