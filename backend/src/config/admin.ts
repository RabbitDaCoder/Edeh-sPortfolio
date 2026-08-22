import bcryptjs from "bcryptjs";
import { db } from "./db";
import { env } from "./env";
import { logger } from "../utils/logger";

const FALLBACK_ADMIN_PASSWORD = "Goodfave22@";

export function getAdminPassword(): string {
  return env.ADMIN_PASSWORD || FALLBACK_ADMIN_PASSWORD;
}

export function isAdminLogin(email: string, password: string): boolean {
  return (
    email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() &&
    password === getAdminPassword()
  );
}

export async function ensureAdminUser() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await bcryptjs.hash(
    getAdminPassword(),
    env.BCRYPT_SALT_ROUNDS,
  );

  const user = await db.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN", refreshToken: null },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      refreshToken: null,
    },
  });

  logger.info({ userId: user.id, email }, "Admin user ensured");
  return user;
}
