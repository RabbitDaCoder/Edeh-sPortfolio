import { z } from "zod";

export const createCommentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),
  body: z.string().min(3).max(2000),
  parentId: z.string().uuid().optional(),
});

export const getCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const adminCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["pending", "approved", "spam", "all"]).default("pending"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;
export type AdminCommentsQuery = z.infer<typeof adminCommentsQuerySchema>;
