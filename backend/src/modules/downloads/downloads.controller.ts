import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
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

    // Record the download
    await downloadService.recordDownload(id);

    // Determine filename from the URL or label
    const urlPath = new URL(download.fileUrl).pathname;
    const ext = urlPath.substring(urlPath.lastIndexOf("."));
    const filename = `${download.label}${ext || ".pdf"}`;

    // Fetch file from Cloudinary (node-fetch follows redirects automatically)
    const upstream = await fetch(download.fileUrl, { redirect: "follow" });
    if (!upstream.ok || !upstream.body) {
      res.status(502).json({ error: "Failed to fetch file" });
      return;
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) res.setHeader("Content-Length", contentLength);

    // Convert Web ReadableStream to Node Readable and pipe
    const nodeStream = Readable.fromWeb(upstream.body as any);
    nodeStream.pipe(res);
  } catch (err) {
    next(err);
  }
}
