import { downloadRepository } from "./downloads.repository";
import { cacheService } from "../../services/cache.service";
import { deleteFile, uploadFile } from "../../storage/storage";
import { CreateDownloadInput, UpdateDownloadInput } from "./downloads.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 600;

export class DownloadService {
  async getDownloads() {
    const cacheKey = "downloads:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const downloads = await downloadRepository.findAll();
    await cacheService.set(cacheKey, downloads, CACHE_TTL);
    return downloads;
  }

  async getDownloadById(id: string) {
    return downloadRepository.findById(id);
  }

  async createDownload(data: CreateDownloadInput, file?: Express.Multer.File) {
    let fileUrl = data.fileUrl;
    let publicId: string | undefined;

    if (file) {
      const result = await uploadFile(file, "documents");
      fileUrl = result.url;
      publicId = result.key;
    }

    if (!fileUrl) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "File or URL is required");
    }

    const download = await downloadRepository.create({
      ...data,
      fileUrl,
      publicId,
    });
    await this.refreshCache();
    return download;
  }

  async updateDownload(
    id: string,
    data: UpdateDownloadInput,
    file?: Express.Multer.File,
  ) {
    const download = await downloadRepository.findById(id);
    if (!download) throw new AppError(ErrorCode.DOWNLOAD_NOT_FOUND);

    let fileUrl = data.fileUrl;
    let publicId = download.publicId;

    if (file) {
      await deleteFile(download.publicId).catch(() => {});
      const result = await uploadFile(file, "documents");
      fileUrl = result.url;
      publicId = result.key;
    }

    const updated = await downloadRepository.update(id, {
      ...data,
      ...(fileUrl ? { fileUrl } : {}),
      ...(publicId !== download.publicId ? { publicId } : {}),
    });
    await this.refreshCache();
    return updated;
  }

  async deleteDownload(id: string) {
    const download = await downloadRepository.findById(id);
    if (!download) throw new AppError(ErrorCode.DOWNLOAD_NOT_FOUND);

    if (download.publicId) {
      await deleteFile(download.publicId);
    }

    await downloadRepository.delete(id);
    await this.refreshCache();
  }

  async recordDownload(id: string) {
    const download = await downloadRepository.findById(id);
    if (!download) throw new AppError(ErrorCode.DOWNLOAD_NOT_FOUND);

    await downloadRepository.incrementDownloads(id);
  }

  private async refreshCache() {
    try {
      await cacheService.del("downloads:all");
      const downloads = await downloadRepository.findAll();
      await cacheService.set("downloads:all", downloads, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh downloads cache");
    }
  }
}

export const downloadService = new DownloadService();
