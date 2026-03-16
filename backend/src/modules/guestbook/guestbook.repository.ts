import { db } from "../../config/db";

export class GuestbookRepository {
  async findAll(params: { page?: number; limit?: number } = {}) {
    const limit = params.limit ?? 50;
    const skip = ((params.page ?? 1) - 1) * limit;

    const [entries, total] = await Promise.all([
      db.guestbookEntry.findMany({
        where: { approved: true, flagged: false },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          handle: true,
          message: true,
          pinned: true,
          country: true,
          createdAt: true,
        },
      }),
      db.guestbookEntry.count({
        where: { approved: true, flagged: false },
      }),
    ]);

    return { entries, total };
  }

  async create(data: {
    name: string;
    email: string;
    message: string;
    handle?: string;
    ipAddress?: string;
    userAgent?: string;
    country?: string;
  }) {
    return db.guestbookEntry.create({
      data: { ...data, approved: false },
      select: {
        id: true,
        name: true,
        handle: true,
        message: true,
        createdAt: true,
        approved: true,
      },
    });
  }

  async findAllAdmin(
    params: {
      approved?: boolean;
      flagged?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const limit = params.limit ?? 30;
    const skip = ((params.page ?? 1) - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.approved !== undefined) where.approved = params.approved;
    if (params.flagged !== undefined) where.flagged = params.flagged;

    const [entries, total] = await Promise.all([
      db.guestbookEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.guestbookEntry.count({ where }),
    ]);

    return { entries, total };
  }

  async findById(id: string) {
    return db.guestbookEntry.findUnique({ where: { id } });
  }

  async approve(id: string) {
    return db.guestbookEntry.update({
      where: { id },
      data: { approved: true },
    });
  }

  async pin(id: string, pinned: boolean) {
    return db.guestbookEntry.update({
      where: { id },
      data: { pinned },
    });
  }

  async flag(id: string) {
    return db.guestbookEntry.update({
      where: { id },
      data: { flagged: true, approved: false },
    });
  }

  async delete(id: string) {
    return db.guestbookEntry.delete({ where: { id } });
  }
}

export const guestbookRepository = new GuestbookRepository();
