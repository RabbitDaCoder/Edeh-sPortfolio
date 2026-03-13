import { db } from "../../config/db";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "./testimonials.schema";

export class TestimonialRepository {
  async findAll(published?: boolean) {
    return db.testimonial.findMany({
      where: published !== undefined ? { published } : {},
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string) {
    return db.testimonial.findUnique({ where: { id } });
  }

  async create(data: CreateTestimonialInput) {
    return db.testimonial.create({ data });
  }

  async update(id: string, data: UpdateTestimonialInput) {
    return db.testimonial.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.testimonial.delete({ where: { id } });
  }
}

export const testimonialRepository = new TestimonialRepository();
