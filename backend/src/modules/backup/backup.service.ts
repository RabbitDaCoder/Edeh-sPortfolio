import { db } from "../../config/db";
import { logger } from "../../utils/logger";

export interface BackupData {
  version: string;
  createdAt: string;
  tables: Record<string, unknown[]>;
}

const MODEL_NAMES = [
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

/**
 * Export all database tables as a JSON snapshot.
 * Passwords are stripped from User records.
 */
export async function createBackup(): Promise<BackupData> {
  const tables: Record<string, unknown[]> = {};

  for (const model of MODEL_NAMES) {
    try {
      // Prisma client exposes each model as a property on `db`
      const records = await (db as any)[model].findMany();
      tables[model] = records;
    } catch (err) {
      logger.warn({ model, err }, `Skipping model ${model} during backup`);
      tables[model] = [];
    }
  }

  // Strip sensitive fields
  if (tables.user) {
    tables.user = (tables.user as any[]).map(
      ({ password, refreshToken, ...rest }) => rest,
    );
  }

  return {
    version: "1.0",
    createdAt: new Date().toISOString(),
    tables,
  };
}

/**
 * Restore database from a backup snapshot.
 * Uses upsert to avoid duplicate-key errors — safe to run multiple times.
 */
export async function restoreBackup(
  backup: BackupData,
): Promise<{ restored: Record<string, number> }> {
  const restored: Record<string, number> = {};

  // Order matters — restore parents before children
  const orderedModels = [
    "siteProfile",
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
    "polaroid",
    "comment",
    "guestbookEntry",
    "notification",
  ];

  for (const model of orderedModels) {
    const records = backup.tables[model];
    if (!records || records.length === 0) {
      restored[model] = 0;
      continue;
    }

    let count = 0;
    for (const record of records) {
      try {
        const { id, password, refreshToken, ...data } = record as any;
        await (db as any)[model].upsert({
          where: { id },
          update: data,
          create: { id, ...data },
        });
        count++;
      } catch (err) {
        logger.warn({ model, err }, `Failed to restore record in ${model}`);
      }
    }
    restored[model] = count;
  }

  return { restored };
}
