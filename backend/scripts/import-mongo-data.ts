import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface PostgresUser {
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

async function main(): Promise<void> {
  const dumpPath = path.resolve(__dirname, "postgres-export.json");
  const dump = JSON.parse(fs.readFileSync(dumpPath, "utf-8")) as {
    user: PostgresUser[];
  };

  for (const u of dump.user) {
    const existing = await prisma.user.findUnique({
      where: { email: u.email },
    });
    if (existing) {
      console.log(`- user ${u.email} already exists in MongoDB, skipping`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: u.email,
        password: u.password,
        role: u.role,
        // refreshToken intentionally omitted — the old JWT embeds the
        // Postgres id, which no longer matches; a fresh one issues on login.
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      },
    });
    console.log(`✓ imported user ${u.email}`);
  }
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
