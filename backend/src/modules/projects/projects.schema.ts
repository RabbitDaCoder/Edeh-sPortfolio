import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(1),
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  typographicMark: z.string().optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
