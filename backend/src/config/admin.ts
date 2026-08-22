import bcryptjs from "bcryptjs";
import { db } from "./db";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function ensureAdminUser(): Promise<void> {
  if (!env.ADMIN_PASSWORD) return;

  const email = env.ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await bcryptjs.hash(
    env.ADMIN_PASSWORD,
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
}
