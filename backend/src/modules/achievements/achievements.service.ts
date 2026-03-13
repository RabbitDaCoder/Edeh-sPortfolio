import { achievementRepository } from "./achievements.repository";
import { cacheService } from "../../services/cache.service";
import {
  CreateAchievementInput,
  UpdateAchievementInput,
} from "./achievements.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class AchievementService {
  async getAchievements() {
    const cacheKey = "achievements:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const achievements = await achievementRepository.findAll();
    await cacheService.set(cacheKey, achievements, 600);
    return achievements;
  }

  async createAchievement(data: CreateAchievementInput) {
    const achievement = await achievementRepository.create(data);
    await cacheService.del("achievements:all");
    return achievement;
  }

  async updateAchievement(id: string, data: UpdateAchievementInput) {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) throw new AppError(ErrorCode.ACHIEVEMENT_NOT_FOUND);

    const updated = await achievementRepository.update(id, data);
    await cacheService.del("achievements:all");
    return updated;
  }

  async deleteAchievement(id: string) {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) throw new AppError(ErrorCode.ACHIEVEMENT_NOT_FOUND);

    await achievementRepository.delete(id);
    await cacheService.del("achievements:all");
  }
}

export const achievementService = new AchievementService();
