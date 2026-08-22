import bcryptjs from "bcryptjs";
import { db, mongoClient } from "../src/config/db";

const EMAIL = "edehchinedu59@gmail.com";
const PASSWORD = "Goodfave22@";
const SALT_ROUNDS = 12;

async function main(): Promise<void> {
  const hashedPassword = await bcryptjs.hash(PASSWORD, SALT_ROUNDS);
  const email = EMAIL.toLowerCase();

  const user = await db.user.upsert({
    where: { email },
    update: { password: hashedPassword, refreshToken: null },
    create: { email, password: hashedPassword, role: "ADMIN" },
  });

  console.log(`admin credentials set for ${user.email} (id: ${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
