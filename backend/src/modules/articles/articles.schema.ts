import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const getArticlesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  published: z.coerce.boolean().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type GetArticlesQuery = z.infer<typeof getArticlesQuerySchema>;
