import { Request, Response, NextFunction } from "express";
import { notificationService } from "../../services/notification.service";
import { success } from "../../utils/apiResponse";

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const read =
      req.query.read === "true"
        ? true
        : req.query.read === "false"
          ? false
          : undefined;
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const data = await notificationService.getAll({ read, limit, page });
    success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const count = await notificationService.getUnreadCount();
    success(res, { count });
  } catch (err) {
    next(err);
  }
}

export async function markRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const n = await notificationService.markRead(req.params.id);
    success(res, n);
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await notificationService.markAllRead();
    success(res, { message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await notificationService.delete(req.params.id);
    success(res, { message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
}
