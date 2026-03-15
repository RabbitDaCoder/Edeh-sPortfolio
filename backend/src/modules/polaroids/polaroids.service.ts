import { polaroidRepository } from "./polaroids.repository";
import { cacheService } from "../../services/cache.service";
import { CreatePolaroidInput, UpdatePolaroidInput } from "./polaroids.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class PolaroidService {
  async getPolaroids(published?: boolean) {
    const cacheKey = `polaroids:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const polaroids = await polaroidRepository.findAll(published);
    await cacheService.set(cacheKey, polaroids, 600);
    return polaroids;
  }

  async getPolaroidById(id: string) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);
    return polaroid;
  }

  async createPolaroid(data: CreatePolaroidInput) {
    const polaroid = await polaroidRepository.create(data);
    await cacheService.invalidatePattern("polaroids:*");
    return polaroid;
  }

  async updatePolaroid(id: string, data: UpdatePolaroidInput) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);

    const updated = await polaroidRepository.update(id, data);
    await cacheService.invalidatePattern("polaroids:*");
    return updated;
  }

  async deletePolaroid(id: string) {
    const polaroid = await polaroidRepository.findById(id);
    if (!polaroid) throw new AppError(ErrorCode.POLAROID_NOT_FOUND);

    await polaroidRepository.delete(id);
    await cacheService.invalidatePattern("polaroids:*");
  }
}

export const polaroidService = new PolaroidService();
