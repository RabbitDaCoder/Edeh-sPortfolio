import { z } from "zod";

export const createCareerSchema = z.object({
  type: z.enum([
    "EDUCATION",
    "JOB",
    "FREELANCE",
    "VOLUNTEER",
    "ACHIEVEMENT",
    "PLAN",
  ]),
  title: z.string().min(1).max(255),
  organisation: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  current: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const updateCareerSchema = createCareerSchema.partial();

export const getCareerQuerySchema = z.object({
  type: z
    .enum(["EDUCATION", "JOB", "FREELANCE", "VOLUNTEER", "ACHIEVEMENT", "PLAN"])
    .optional(),
});

export type CreateCareerInput = z.infer<typeof createCareerSchema>;
export type UpdateCareerInput = z.infer<typeof updateCareerSchema>;
