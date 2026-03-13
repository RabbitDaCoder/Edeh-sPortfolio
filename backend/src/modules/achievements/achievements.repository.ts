import { db } from "../../config/db";
import {
  CreateAchievementInput,
  UpdateAchievementInput,
} from "./achievements.schema";

export class AchievementRepository {
  async findAll() {
    return db.achievement.findMany({ orderBy: { date: "desc" } });
  }

  async findById(id: string) {
    return db.achievement.findUnique({ where: { id } });
  }

  async create(data: CreateAchievementInput) {
    return db.achievement.create({ data });
  }

  async update(id: string, data: UpdateAchievementInput) {
    return db.achievement.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.achievement.delete({ where: { id } });
  }
}

export const achievementRepository = new AchievementRepository();
