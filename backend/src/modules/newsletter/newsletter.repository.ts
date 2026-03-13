import { db } from "../../config/db";
import { SubscribeNewsletterInput } from "./newsletter.schema";

export class NewsletterRepository {
  async subscribe(data: SubscribeNewsletterInput) {
    return db.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: {},
      create: { email: data.email },
    });
  }

  async unsubscribe(email: string) {
    return db.newsletterSubscriber.delete({
      where: { email },
    });
  }

  async findAll() {
    return db.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });
  }
}

export const newsletterRepository = new NewsletterRepository();
