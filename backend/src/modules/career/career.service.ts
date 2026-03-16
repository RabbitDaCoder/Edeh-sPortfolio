import { careerRepository } from "./career.repository";
import { cacheService } from "../../services/cache.service";
import { CreateCareerInput, UpdateCareerInput } from "./career.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class CareerService {
  async getCareer(type?: string) {
    const cacheKey = `career:${type || "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const timeline = await careerRepository.findAll(type);
    await cacheService.set(cacheKey, timeline, CACHE_TTL);
    return timeline;
  }

  async createCareer(data: CreateCareerInput) {
    const career = await careerRepository.create(data);
    await this.refreshCache();
    return career;
  }

  async updateCareer(id: string, data: UpdateCareerInput) {
    const career = await careerRepository.findById(id);
    if (!career) throw new AppError(ErrorCode.CAREER_TIMELINE_NOT_FOUND);

    const updated = await careerRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deleteCareer(id: string) {
    const career = await careerRepository.findById(id);
    if (!career) throw new AppError(ErrorCode.CAREER_TIMELINE_NOT_FOUND);

    await careerRepository.delete(id);
    await this.refreshCache();
  }

  private async refreshCache() {
    try {
      await cacheService.invalidatePattern("career:*");
      const timeline = await careerRepository.findAll();
      await cacheService.set("career:all", timeline, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh career cache");
    }
  }
}

export const careerService = new CareerService();
