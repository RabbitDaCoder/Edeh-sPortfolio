import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { upload } from "../../middleware/upload";
import {
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
  recordDownload,
  serveDownload,
} from "./downloads.controller";

const router = Router();

router.get("/", getDownloads);
router.get("/:id/file", serveDownload);
router.post("/:id/record", recordDownload);
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  idempotencyMiddleware,
  createDownload,
);
router.patch(
  "/:id",
  authMiddleware,
  upload.single("file"),
  idempotencyMiddleware,
  updateDownload,
);
router.delete("/:id", authMiddleware, deleteDownload);

export default router;
