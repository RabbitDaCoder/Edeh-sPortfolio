import { createBackup } from "../modules/backup/backup.service";
import { logger } from "../utils/logger";
import { cloudinary } from "../config/cloudinary";

const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_BACKUPS = 7; // keep last 7 days

let startupTimer: ReturnType<typeof setTimeout> | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

/**
 * Upload a JSON backup to Cloudinary as a raw file.
 */
async function uploadBackupToCloudinary(data: object): Promise<string> {
  const json = JSON.stringify(data);
  const base64 = Buffer.from(json).toString("base64");
  const dataUri = `data:application/json;base64,${base64}`;
  const timestamp = new Date().toISOString().slice(0, 10);

  const result = await cloudinary.uploader.upload(dataUri, {
    resource_type: "raw",
    folder: "portfolio-backups",
    public_id: `backup-${timestamp}`,
    overwrite: true,
  });

  return result.secure_url;
}

/**
 * Clean up old backups beyond MAX_BACKUPS.
 */
async function pruneOldBackups(): Promise<void> {
  try {
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: "portfolio-backups/",
      max_results: 50,
    });

    if (resources.length <= MAX_BACKUPS) return;

    // Sort oldest first
    const sorted = resources.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    const toDelete = sorted.slice(0, sorted.length - MAX_BACKUPS);
    for (const res of toDelete) {
      await cloudinary.uploader.destroy(res.public_id, { resource_type: "raw" });
      logger.info({ publicId: res.public_id }, "Pruned old backup");
    }
  } catch (err) {
    logger.warn(err, "Failed to prune old backups");
  }
}

async function runBackup(): Promise<void> {
  try {
    logger.info("Starting scheduled database backup...");
    const backup = await createBackup();
    const url = await uploadBackupToCloudinary(backup);
    logger.info({ url }, "Scheduled backup uploaded to Cloudinary");
    await pruneOldBackups();
  } catch (err) {
    logger.error(err, "Scheduled backup failed");
  }
}

/**
 * Start the daily backup scheduler.
 */
export function startBackupScheduler(): void {
  // Run first backup 5 minutes after server start
  startupTimer = setTimeout(() => {
    startupTimer = null;
    runBackup();
    timer = setInterval(runBackup, BACKUP_INTERVAL_MS);
  }, 5 * 60 * 1000);

  logger.info("Backup scheduler initialized — first backup in 5 minutes, then every 24h");
}

export function stopBackupScheduler(): void {
  if (startupTimer) {
    clearTimeout(startupTimer);
    startupTimer = null;
  }
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
