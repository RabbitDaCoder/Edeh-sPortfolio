import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const MODELS = [
  "user",
  "blog",
  "article",
  "book",
  "careerTimeline",
  "achievement",
  "download",
  "newsletterSubscriber",
  "contactMessage",
  "project",
  "skill",
  "testimonial",
  "siteProfile",
  "polaroid",
  "comment",
  "guestbookEntry",
  "notification",
] as const;

async function main(): Promise<void> {
  const dump: Record<string, unknown[]> = {};

  for (const model of MODELS) {
    // @ts-expect-error dynamic model access
    const rows = await prisma[model].findMany();
    dump[model] = rows;
    console.log(`✓ exported ${rows.length} rows from ${model}`);
  }

  const outPath = path.resolve(__dirname, "postgres-export.json");
  fs.writeFileSync(outPath, JSON.stringify(dump, null, 2));
  console.log(`\nWrote export to ${outPath}`);
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
