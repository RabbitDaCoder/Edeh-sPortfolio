import { db } from "../../config/db";

export class DownloadRepository {
  async findAll() {
    return db.download.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return db.download.findUnique({ where: { id } });
  }

  async create(data: {
    label: string;
    fileUrl: string;
    publicId?: string;
    version?: string;
    active?: boolean;
  }) {
    return db.download.create({ data });
  }

  async update(id: string, data: Record<string, any>) {
    return db.download.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.download.delete({ where: { id } });
  }

  async incrementDownloads(id: string) {
    return db.download.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  }
}

export const downloadRepository = new DownloadRepository();
