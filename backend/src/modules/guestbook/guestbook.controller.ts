import { Request, Response, NextFunction } from "express";
import { guestbookService } from "./guestbook.service";
import { success } from "../../utils/apiResponse";
import { buildPaginatedResponse } from "../../utils/pagination";

// ─── Public ──────────────────────────────────────────────────────────────────

export async function getEntries(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const { entries, total } = await guestbookService.getEntries(page);
    const response = buildPaginatedResponse(entries, total, page, 50);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function addEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get("user-agent");
    const entry = await guestbookService.addEntry({
      ...req.body,
      ipAddress,
      userAgent,
    });
    success(
      res,
      {
        entry,
        message: "Your message is awaiting approval. It will appear soon.",
      },
      201,
    );
  } catch (err) {
    next(err);
  }
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function getAllAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const approved =
      req.query.approved !== undefined
        ? req.query.approved === "true"
        : undefined;
    const flagged =
      req.query.flagged !== undefined
        ? req.query.flagged === "true"
        : undefined;

    const { entries, total } = await guestbookService.getAllAdmin({
      approved,
      flagged,
      page,
    });
    const response = buildPaginatedResponse(entries, total, page, 30);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function approveEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await guestbookService.approve(req.params.id);
    success(res, entry);
  } catch (err) {
    next(err);
  }
}

export async function pinEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const pinned = req.body.pinned ?? true;
    const entry = await guestbookService.pin(req.params.id, pinned);
    success(res, entry);
  } catch (err) {
    next(err);
  }
}

export async function flagEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entry = await guestbookService.flag(req.params.id);
    success(res, entry);
  } catch (err) {
    next(err);
  }
}

export async function deleteEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await guestbookService.delete(req.params.id);
    success(res, { message: "Guestbook entry deleted" });
  } catch (err) {
    next(err);
  }
}
