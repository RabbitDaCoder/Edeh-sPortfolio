import { db } from "../../config/db";
import { CreateCareerInput, UpdateCareerInput } from "./career.schema";

export class CareerRepository {
  async findById(id: string) {
    return db.careerTimeline.findUnique({ where: { id } });
  }

  async findAll(type?: string) {
    return db.careerTimeline.findMany({
      where: type ? { type: type as any } : {},
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
  }

  async create(data: CreateCareerInput) {
    return db.careerTimeline.create({ data });
  }

  async update(id: string, data: UpdateCareerInput) {
    return db.careerTimeline.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.careerTimeline.delete({ where: { id } });
  }
}

export const careerRepository = new CareerRepository();
