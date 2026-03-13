import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255).optional(),
  company: z.string().max(255).optional(),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  projectType: z.string().max(255).optional(),
  message: z.string().min(1).max(5000),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
