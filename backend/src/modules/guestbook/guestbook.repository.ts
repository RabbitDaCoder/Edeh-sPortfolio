import { db } from "../../config/db";

export class GuestbookRepository {
  private readonly entrySelect = {
    id: true,
    name: true,
    handle: true,
    message: true,
    pinned: true,
    country: true,
    createdAt: true,
  } as const;

  async findFirstEver() {
    return db.guestbookEntry.findFirst({
      where: { approved: true, flagged: false },
      orderBy: { createdAt: "asc" },
      select: this.entrySelect,
    });
  }

  async findAll(params: { page?: number; limit?: number } = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const skip = (page - 1) * limit;

    const [firstEver, entries, total] = await Promise.all([
      this.findFirstEver(),
      db.guestbookEntry.findMany({
        where: { approved: true, flagged: false },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip,
        select: this.entrySelect,
      }),
      db.guestbookEntry.count({
        where: { approved: true, flagged: false },
      }),
    ]);

    const firstId = firstEver?.id;

    // On page 1, remove the first-ever entry from its natural position
    // and prepend it so it always appears at index 0
    if (page === 1 && firstId) {
      const filtered = entries.filter((e) => e.id !== firstId);
      const tagged = [
        { ...firstEver, isFirstPost: true },
        ...filtered.map((e) => ({ ...e, isFirstPost: false })),
      ];
      return { entries: tagged, total };
    }

    // On later pages, just exclude the first-ever entry (already shown on p1)
    const tagged = entries
      .filter((e) => e.id !== firstId)
      .map((e) => ({ ...e, isFirstPost: false }));
    return { entries: tagged, total };
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
      data: { ...data, approved: true },
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
