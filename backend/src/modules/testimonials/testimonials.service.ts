import { testimonialRepository } from "./testimonials.repository";
import { cacheService } from "../../services/cache.service";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "./testimonials.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class TestimonialService {
  async getTestimonials(published?: boolean) {
    const cacheKey = `testimonials:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const testimonials = await testimonialRepository.findAll(published);
    await cacheService.set(cacheKey, testimonials, 600);
    return testimonials;
  }

  async createTestimonial(data: CreateTestimonialInput) {
    const testimonial = await testimonialRepository.create(data);
    await cacheService.invalidatePattern("testimonials:*");
    return testimonial;
  }

  async updateTestimonial(id: string, data: UpdateTestimonialInput) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError(ErrorCode.TESTIMONIAL_NOT_FOUND);

    const updated = await testimonialRepository.update(id, data);
    await cacheService.invalidatePattern("testimonials:*");
    return updated;
  }

  async deleteTestimonial(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError(ErrorCode.TESTIMONIAL_NOT_FOUND);

    await testimonialRepository.delete(id);
    await cacheService.invalidatePattern("testimonials:*");
  }
}

export const testimonialService = new TestimonialService();
