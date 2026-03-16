import { z } from "zod";

export const BLOG_CATEGORIES = [
  // Tech
  "Web Development",
  "Backend Engineering",
  "DevOps & Cloud",
  "IoT & Hardware",
  "Blockchain",
  // Life & Personal
  "Life in Nigeria",
  "Freelancing",
  "Career Growth",
  "Productivity",
  "Health & Wellness",
  // Thought & Culture
  "Design Thinking",
  "Open Source",
  "Tech Culture",
  "Book Reviews",
  "Hot Takes",
  // Meta
  "Behind the Build",
  "Changelog",
  "Tutorials",
  "Case Studies",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const createBlogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  category: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readTime: z.number().optional(),
  tags: z.array(z.string()).default([]),
  contentSource: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const getBlogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  published: z.coerce.boolean().optional(),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type GetBlogsQuery = z.infer<typeof getBlogsQuerySchema>;
