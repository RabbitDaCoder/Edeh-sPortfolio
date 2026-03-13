import { downloadRepository } from "./downloads.repository";
import { cacheService } from "../../services/cache.service";
import { cloudinaryService } from "../../services/cloudinary.service";
import { CreateDownloadInput, UpdateDownloadInput } from "./downloads.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class DownloadService {
  async getDownloads() {
    const cacheKey = "downloads:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const downloads = await downloadRepository.findAll();
    await cacheService.set(cacheKey, downloads, 600);
    return downloads;
  }

  async getDownloadById(id: string) {
    return downloadRepository.findById(id);
  }

  async createDownload(data: CreateDownloadInput, file?: Express.Multer.File) {
    let fileUrl = data.fileUrl;
    let publicId: string | undefined;

    if (file) {
      // Include original filename so Cloudinary preserves the extension for raw files
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const result = await cloudinaryService.upload(file.buffer, {
        folder: "portfolio/downloads",
        resourceType: "raw",
        publicId: safeName,
      });
      fileUrl = result.url;
      publicId = result.publicId;
    }

    if (!fileUrl) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "File or URL is required");
    }

    const download = await downloadRepository.create({
      ...data,
      fileUrl,
      publicId,
    });
    await cacheService.del("downloads:all");
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
      if (download.publicId) {
        await cloudinaryService.destroy(download.publicId).catch(() => {});
      }
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const result = await cloudinaryService.upload(file.buffer, {
        folder: "portfolio/downloads",
        resourceType: "raw",
        publicId: safeName,
      });
      fileUrl = result.url;
      publicId = result.publicId;
    }

    const updated = await downloadRepository.update(id, {
      ...data,
      ...(fileUrl ? { fileUrl } : {}),
      ...(publicId !== download.publicId ? { publicId } : {}),
    });
    await cacheService.del("downloads:all");
    return updated;
  }

  async deleteDownload(id: string) {
    const download = await downloadRepository.findById(id);
    if (!download) throw new AppError(ErrorCode.DOWNLOAD_NOT_FOUND);

    if (download.publicId) {
      await cloudinaryService.destroy(download.publicId).catch(() => {});
    }

    await downloadRepository.delete(id);
    await cacheService.del("downloads:all");
  }

  async recordDownload(id: string) {
    const download = await downloadRepository.findById(id);
    if (!download) throw new AppError(ErrorCode.DOWNLOAD_NOT_FOUND);

    await downloadRepository.incrementDownloads(id);
  }
}

export const downloadService = new DownloadService();
