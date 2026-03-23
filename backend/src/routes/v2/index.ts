import { Router } from "express";
import {
  publicGuestbookRouter,
  adminGuestbookRouter,
} from "../../modules/guestbook/guestbook.routes";
import notificationRouter from "../../modules/notifications/notification.routes";

const router = Router();

router.use("/guestbook", publicGuestbookRouter);
router.use("/admin/guestbook", adminGuestbookRouter);
router.use("/admin/notifications", notificationRouter);

export default router;
