import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  readTime: z.number().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const getBlogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  published: z.coerce.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type GetBlogsQuery = z.infer<typeof getBlogsQuerySchema>;
