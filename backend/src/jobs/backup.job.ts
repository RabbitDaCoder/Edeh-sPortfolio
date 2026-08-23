import { createBackup } from "../modules/backup/backup.service";
import { logger } from "../utils/logger";
import { pruneBackups, uploadJson } from "../storage/storage";

const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_BACKUPS = 7; // keep last 7 days

let startupTimer: ReturnType<typeof setTimeout> | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

/**
 * Upload a JSON backup to R2.
 */
async function uploadBackupToR2(data: object): Promise<string> {
  const timestamp = new Date().toISOString().slice(0, 10);
  return uploadJson(data, `backup-${timestamp}.json`);
}

async function runBackup(): Promise<void> {
  try {
    logger.info("Starting scheduled database backup...");
    const backup = await createBackup();
    const url = await uploadBackupToR2(backup);
    logger.info({ url }, "Scheduled backup uploaded to R2");
    await pruneBackups(MAX_BACKUPS);
  } catch (err) {
    logger.error(err, "Scheduled backup failed");
  }
}

/**
 * Start the daily backup scheduler.
 */
export function startBackupScheduler(): void {
  // Run first backup 5 minutes after server start
  startupTimer = setTimeout(
    () => {
      startupTimer = null;
      runBackup();
      timer = setInterval(runBackup, BACKUP_INTERVAL_MS);
    },
    5 * 60 * 1000,
  );

  logger.info(
    "Backup scheduler initialized — first backup in 5 minutes, then every 24h",
  );
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
