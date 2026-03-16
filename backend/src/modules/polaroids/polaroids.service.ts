import { polaroidRepository } from "./polaroids.repository";
import { cacheService } from "../../services/cache.service";
import { CreatePolaroidInput, UpdatePolaroidInput } from "./polaroids.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class PolaroidService {
  async getPolaroids(published?: boolean) {
    const cacheKey = `polaroids:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const polaroids = await polaroidRepository.findAll(published);
    await cacheService.set(cacheKey, polaroids, CACHE_TTL);
    return polaroids;
  }

  async getPolaroidById(id: string) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);
    return polaroid;
  }

  async createPolaroid(data: CreatePolaroidInput) {
    const polaroid = await polaroidRepository.create(data);
    await this.refreshCache();
    return polaroid;
  }

  async updatePolaroid(id: string, data: UpdatePolaroidInput) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);

    const updated = await polaroidRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deletePolaroid(id: string) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);

    await polaroidRepository.delete(id);
    await this.refreshCache();
  }

  private async refreshCache() {
    try {
      await cacheService.invalidatePattern("polaroids:*");
      const polaroids = await polaroidRepository.findAll();
      await cacheService.set("polaroids:all", polaroids, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh polaroids cache");
    }
  }
}

export const polaroidService = new PolaroidService();
