import { z } from "zod";

export const createAchievementSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
