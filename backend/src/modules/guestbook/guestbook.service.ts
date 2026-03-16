import { guestbookRepository } from "./guestbook.repository";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const SPAM_PATTERNS = [
  /\b(viagra|casino|poker|crypto|forex|loan|seo|backlink)\b/i,
  /<[a-z]+[^>]*>/i,
  /https?:\/\/[^\s]{60,}/,
];

function isSpam(message: string, name: string): boolean {
  const text = `${name} ${message}`;
  return SPAM_PATTERNS.some((p) => p.test(text));
}

export class GuestbookService {
  async getEntries(page: number = 1) {
    return guestbookRepository.findAll({ page });
  }

  async addEntry(data: {
    name: string;
    email: string;
    message: string;
    handle?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const entry = await guestbookRepository.create({
      ...data,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      message: data.message.trim(),
      handle: data.handle?.trim() || undefined,
    });

    if (isSpam(data.message, data.name)) {
      await guestbookRepository.flag(entry.id);
      logger.info(
        { entryId: entry.id },
        "Guestbook entry auto-flagged as spam",
      );
    }

    logger.info({ entryId: entry.id }, "New guestbook entry submitted");
    return entry;
  }

  async getAllAdmin(params: {
    approved?: boolean;
    flagged?: boolean;
    page?: number;
  }) {
    return guestbookRepository.findAllAdmin(params);
  }

  async approve(id: string) {
    const entry = await guestbookRepository.findById(id);
    if (!entry) {
      throw new AppError(ErrorCode.GUESTBOOK_NOT_FOUND);
    }
    const approved = await guestbookRepository.approve(id);
    logger.info({ entryId: id }, "Guestbook entry approved");
    return approved;
  }

  async pin(id: string, pinned: boolean) {
    const entry = await guestbookRepository.findById(id);
    if (!entry) {
      throw new AppError(ErrorCode.GUESTBOOK_NOT_FOUND);
    }
    const updated = await guestbookRepository.pin(id, pinned);
    logger.info({ entryId: id, pinned }, "Guestbook entry pin toggled");
    return updated;
  }

  async flag(id: string) {
    const entry = await guestbookRepository.findById(id);
    if (!entry) {
      throw new AppError(ErrorCode.GUESTBOOK_NOT_FOUND);
    }
    const flagged = await guestbookRepository.flag(id);
    logger.info({ entryId: id }, "Guestbook entry flagged");
    return flagged;
  }

  async delete(id: string) {
    const entry = await guestbookRepository.findById(id);
    if (!entry) {
      throw new AppError(ErrorCode.GUESTBOOK_NOT_FOUND);
    }
    await guestbookRepository.delete(id);
    logger.info({ entryId: id }, "Guestbook entry deleted");
  }
}

export const guestbookService = new GuestbookService();
