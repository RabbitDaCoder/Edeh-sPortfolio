import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  quote: z.string().min(1),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
