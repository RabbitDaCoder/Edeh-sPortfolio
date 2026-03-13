import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(500).optional(),
  bio1: z.string().optional(),
  bio2: z.string().optional(),
  pullQuote: z.string().max(500).optional(),
  availability: z.string().max(100).optional(),
  email: z.string().email().optional(),
  location: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
