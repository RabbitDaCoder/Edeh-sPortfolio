import { achievementRepository } from "./achievements.repository";
import { cacheService } from "../../services/cache.service";
import {
  CreateAchievementInput,
  UpdateAchievementInput,
} from "./achievements.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class AchievementService {
  async getAchievements() {
    const cacheKey = "achievements:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const achievements = await achievementRepository.findAll();
    await cacheService.set(cacheKey, achievements, CACHE_TTL);
    return achievements;
  }

  async createAchievement(data: CreateAchievementInput) {
    const achievement = await achievementRepository.create(data);
    await this.refreshCache();
    return achievement;
  }

  async updateAchievement(id: string, data: UpdateAchievementInput) {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) throw new AppError(ErrorCode.ACHIEVEMENT_NOT_FOUND);

    const updated = await achievementRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deleteAchievement(id: string) {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) throw new AppError(ErrorCode.ACHIEVEMENT_NOT_FOUND);

    await achievementRepository.delete(id);
    await this.refreshCache();
  }

  private async refreshCache() {
    try {
      await cacheService.del("achievements:all");
      const achievements = await achievementRepository.findAll();
      await cacheService.set("achievements:all", achievements, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh achievements cache");
    }
  }
}

export const achievementService = new AchievementService();
