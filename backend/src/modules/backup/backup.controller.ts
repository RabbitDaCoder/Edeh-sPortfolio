import { Request, Response } from "express";
import { createBackup, restoreBackup, BackupData } from "./backup.service";
import { success, error } from "../../utils/apiResponse";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

/**
 * GET /api/v1/admin/backup
 * Download full database backup as JSON.
 */
export async function downloadBackup(req: Request, res: Response) {
  try {
    const backup = await createBackup();
    const filename = `backup-${new Date().toISOString().slice(0, 10)}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.json(backup);
  } catch (err) {
    logger.error(err, "Backup export failed");
    return error(res, ErrorCode.INTERNAL_ERROR, "Backup export failed");
  }
}

/**
 * POST /api/v1/admin/backup/restore
 * Restore database from uploaded JSON backup.
 * Body: full BackupData JSON object.
 */
export async function uploadRestore(req: Request, res: Response) {
  try {
    const backup = req.body as BackupData;

    if (!backup?.version || !backup?.tables) {
      return error(
        res,
        ErrorCode.VALIDATION_ERROR,
        "Invalid backup format — must include version and tables",
      );
    }

    const result = await restoreBackup(backup);
    logger.info(result, "Database restored from backup");
    return success(res, result);
  } catch (err) {
    logger.error(err, "Backup restore failed");
    return error(res, ErrorCode.INTERNAL_ERROR, "Backup restore failed");
  }
}
