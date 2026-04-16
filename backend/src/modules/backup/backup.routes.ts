import { Router } from "express";
import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminGuard } from "../../middleware/auth.middleware";
import { downloadBackup, uploadRestore } from "./backup.controller";

const router = Router();

// All backup routes require auth + admin role
router.get("/", authMiddleware, adminGuard, downloadBackup);
router.post(
  "/restore",
  express.json({ limit: "10mb" }),
  authMiddleware,
  adminGuard,
  uploadRestore,
);

export default router;
