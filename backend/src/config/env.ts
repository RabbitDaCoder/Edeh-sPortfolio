import { z } from "zod";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be set"),
  REDIS_URL: z.string().min(1, "REDIS_URL must be set"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET must be set"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET must be set"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  EMAIL_SERVICE_URL: z.string().min(1, "EMAIL_SERVICE_URL must be set"),
  EMAIL_SERVICE_API_KEY: z.string().min(1, "EMAIL_SERVICE_API_KEY must be set"),
  CORS_ORIGIN: z
    .string()
    .min(1, "CORS_ORIGIN must be set")
    .transform((val) => val.split(",")),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default("12"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME must be set"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY must be set"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET must be set"),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten());
    process.exit(1);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export const env = getEnv();
