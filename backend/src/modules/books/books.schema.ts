import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(1),
  coverImage: z.string().url().optional(),
  price: z.string().transform((v) => parseFloat(v)),
  fileUrl: z.string().url().optional(),
  published: z.boolean().default(false),
});

export const updateBookSchema = createBookSchema.partial();

export const getBooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  published: z.coerce.boolean().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type GetBooksQuery = z.infer<typeof getBooksQuerySchema>;
