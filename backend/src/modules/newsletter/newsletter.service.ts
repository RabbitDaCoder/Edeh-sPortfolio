import { newsletterRepository } from "./newsletter.repository";
import { mailService } from "../../services/mail.service";
import { SubscribeNewsletterInput } from "./newsletter.schema";
import { ErrorCode } from "../../utils/errorCodes";
import { AppError } from "../../middleware/errorHandler";

export class NewsletterService {
  async subscribe(data: SubscribeNewsletterInput) {
    const subscriber = await newsletterRepository.subscribe(data);

    await mailService.sendWelcomeEmail(data.email).catch(() => {});

    return subscriber;
  }

  async unsubscribe(email: string) {
    const subscriber = await newsletterRepository.unsubscribe(email);
    if (!subscriber) {
      throw new AppError(ErrorCode.NOT_FOUND, "Subscriber not found");
    }
    return subscriber;
  }

  async getSubscribers() {
    return newsletterRepository.findAll();
  }
}

export const newsletterService = new NewsletterService();
