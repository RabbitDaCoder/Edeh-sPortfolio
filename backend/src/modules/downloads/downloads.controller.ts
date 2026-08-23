import { Request, Response, NextFunction } from "express";
import { downloadService } from "./downloads.service";
import { success } from "../../utils/apiResponse";
import { createDownloadSchema, updateDownloadSchema } from "./downloads.schema";

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

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(safeFilename)}"`,
    );
    res.redirect(download.fileUrl);
  } catch (err) {
    next(err);
  }
}
