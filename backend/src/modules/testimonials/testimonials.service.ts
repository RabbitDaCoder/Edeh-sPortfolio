import { testimonialRepository } from "./testimonials.repository";
import { cacheService } from "../../services/cache.service";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "./testimonials.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 600;

export class TestimonialService {
  async getTestimonials(published?: boolean) {
    const cacheKey = `testimonials:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const testimonials = await testimonialRepository.findAll(published);
    await cacheService.set(cacheKey, testimonials, CACHE_TTL);
    return testimonials;
  }

  async createTestimonial(data: CreateTestimonialInput) {
    const testimonial = await testimonialRepository.create(data);
    await this.refreshCache();
    return testimonial;
  }

  async updateTestimonial(id: string, data: UpdateTestimonialInput) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError(ErrorCode.TESTIMONIAL_NOT_FOUND);

    const updated = await testimonialRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deleteTestimonial(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError(ErrorCode.TESTIMONIAL_NOT_FOUND);

    await testimonialRepository.delete(id);
    await this.refreshCache();
  }

  private async refreshCache() {
    try {
      await cacheService.invalidatePattern("testimonials:*");
      const testimonials = await testimonialRepository.findAll();
      await cacheService.set("testimonials:all", testimonials, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh testimonials cache");
    }
  }
}

export const testimonialService = new TestimonialService();
