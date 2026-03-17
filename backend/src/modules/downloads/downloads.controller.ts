import { Request, Response, NextFunction } from "express";
import { downloadService } from "./downloads.service";
import { success } from "../../utils/apiResponse";
import { createDownloadSchema, updateDownloadSchema } from "./downloads.schema";
import { cloudinary } from "../../config/cloudinary";
import { logger } from "../../utils/logger";
import axios from "axios";

export async function getDownloads(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const downloads = await downloadService.getDownloads();
    success(res, downloads);
  } catch (err) {
    next(err);
  }
}

export async function getActiveResume(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const downloads = await downloadService.getDownloads();
    const resume = downloads.find((d: any) => d.active);
    if (!resume) {
      res.status(404).json({ error: "No active resume found" });
      return;
    }
    // Delegate to serveDownload by setting the id param
    req.params.id = resume.id;
    await serveDownload(req, res, next);
  } catch (err) {
    next(err);
  }
}

export async function createDownload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = {
      ...req.body,
      active: req.body.active === "true" || req.body.active === true,
    };
    const parsed = createDownloadSchema.parse(body);
    const download = await downloadService.createDownload(parsed, req.file);
    success(res, download, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateDownload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.active !== undefined) {
      body.active = body.active === "true" || body.active === true;
    }
    const parsed = updateDownloadSchema.parse(body);
    const download = await downloadService.updateDownload(id, parsed, req.file);
    success(res, download);
  } catch (err) {
    next(err);
  }
}

export async function deleteDownload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await downloadService.deleteDownload(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}

export async function recordDownload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await downloadService.recordDownload(id);
    success(res, { message: "Download recorded" });
  } catch (err) {
    next(err);
  }
}

export async function serveDownload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const download = await downloadService.getDownloadById(id);
    if (!download || !download.fileUrl) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const isAbsoluteUrl = download.fileUrl.startsWith("http");

    if (!isAbsoluteUrl) {
      res.status(404).json({
        error:
          "File has not been uploaded to cloud storage. Please re-upload via the dashboard.",
      });
      return;
    }

    // Increment download count (fire-and-forget)
    downloadService
      .recordDownload(id)
      .catch((err) => console.error("Failed to record download:", err));

    const filename = download.label || "download.pdf";
    const safeFilename = filename.endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;

    // For Cloudinary resources, proxy the file through the backend.
    // Signed delivery is enabled, so we need to generate signed URLs.
    if (download.fileUrl.includes("cloudinary.com") && download.publicId) {
      try {
        // Use Admin API to get the resource details (confirms it exists and gets fresh URL)
        const resource = await cloudinary.api.resource(download.publicId, {
          resource_type: "raw",
          type: "upload",
        });

        // Generate a signed URL — this bypasses strict transformations / signed delivery
        const signedUrl = cloudinary.url(resource.public_id, {
          resource_type: "raw",
          sign_url: true,
          type: "upload",
          secure: true,
        });

        logger.info({ signedUrl, publicId: resource.public_id }, "Proxying download via signed URL");

        const upstream = await axios.get(signedUrl, {
          responseType: "stream",
          timeout: 30000,
        });

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        );
        res.setHeader(
          "Content-Type",
          upstream.headers["content-type"] || "application/octet-stream",
        );
        if (upstream.headers["content-length"]) {
          res.setHeader("Content-Length", upstream.headers["content-length"]);
        }

        upstream.data.pipe(res);
        return;
      } catch (err: any) {
        logger.error(
          {
            publicId: download.publicId,
            status: err?.response?.status,
            message: err?.message,
          },
          "Cloudinary download proxy failed",
        );

        // Last resort: redirect to stored URL (may fail with 401 but worth trying)
        res.redirect(download.fileUrl);
        return;
      }
    }

    // Non-Cloudinary URLs: redirect directly
    res.redirect(download.fileUrl);
  } catch (err) {
    next(err);
  }
}
