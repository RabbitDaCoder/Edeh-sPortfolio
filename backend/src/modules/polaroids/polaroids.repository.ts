import { db } from "../../config/db";
import { CreatePolaroidInput, UpdatePolaroidInput } from "./polaroids.schema";

export class PolaroidRepository {
  async findAll(published?: boolean) {
    return db.polaroid.findMany({
      where: published !== undefined ? { published } : {},
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string) {
    return db.polaroid.findUnique({ where: { id } });
  }

  async create(data: CreatePolaroidInput) {
    return db.polaroid.create({ data });
  }

  async update(id: string, data: UpdatePolaroidInput) {
    return db.polaroid.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.polaroid.delete({ where: { id } });
  }
}

export const polaroidRepository = new PolaroidRepository();
