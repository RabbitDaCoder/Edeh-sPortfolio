import { z } from "zod";

export const createDownloadSchema = z.object({
  label: z.string().min(1).max(255),
  fileUrl: z.string().url().optional(),
  version: z.string().optional(),
  active: z.boolean().default(true),
});

export const updateDownloadSchema = z.object({
  label: z.string().min(1).max(255).optional(),
  fileUrl: z.string().url().optional(),
  version: z.string().optional(),
  active: z.boolean().optional(),
});

export type CreateDownloadInput = z.infer<typeof createDownloadSchema>;
export type UpdateDownloadInput = z.infer<typeof updateDownloadSchema>;
