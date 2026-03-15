import { z } from "zod";

export const createPolaroidSchema = z.object({
  src: z.string().default(""),
  alt: z.string().min(1, "Alt text is required"),
  caption: z.string().min(1, "Caption is required"),
  rotation: z.number().min(-90).max(90).default(0),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const updatePolaroidSchema = createPolaroidSchema.partial();

export type CreatePolaroidInput = z.infer<typeof createPolaroidSchema>;
export type UpdatePolaroidInput = z.infer<typeof updatePolaroidSchema>;
