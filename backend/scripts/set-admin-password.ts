import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "edehchinedu59@gmail.com";
const PASSWORD = "Goodfave22@";
const SALT_ROUNDS = 12;

async function main(): Promise<void> {
  const hashedPassword = await bcryptjs.hash(PASSWORD, SALT_ROUNDS);
  const email = EMAIL.toLowerCase();

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, refreshToken: null },
    create: { email, password: hashedPassword, role: "ADMIN" },
  });

  console.log(`✓ admin credentials set for ${user.email} (id: ${user.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
