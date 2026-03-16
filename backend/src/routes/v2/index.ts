import { Router } from "express";
import {
  publicGuestbookRouter,
  adminGuestbookRouter,
} from "../../modules/guestbook/guestbook.routes";

const router = Router();

router.use("/guestbook", publicGuestbookRouter);
router.use("/admin/guestbook", adminGuestbookRouter);

export default router;
