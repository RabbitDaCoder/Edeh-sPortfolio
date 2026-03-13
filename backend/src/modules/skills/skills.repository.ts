import { db } from "../../config/db";
import { CreateSkillInput, UpdateSkillInput } from "./skills.schema";

export class SkillRepository {
  async findAll() {
    return db.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
    });
  }

  async findById(id: string) {
    return db.skill.findUnique({ where: { id } });
  }

  async create(data: CreateSkillInput) {
    return db.skill.create({ data });
  }

  async update(id: string, data: UpdateSkillInput) {
    return db.skill.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.skill.delete({ where: { id } });
  }
}

export const skillRepository = new SkillRepository();
