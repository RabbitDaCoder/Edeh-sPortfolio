import { z } from "zod";

const TECH_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "THREED",
  "TOOLS",
] as const;

export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(TECH_CATEGORIES),
  order: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
