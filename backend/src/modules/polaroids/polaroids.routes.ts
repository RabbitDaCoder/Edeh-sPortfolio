import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { createPolaroidSchema, updatePolaroidSchema } from "./polaroids.schema";
import {
  getPolaroids,
  getPolaroidById,
  createPolaroid,
  updatePolaroid,
  deletePolaroid,
} from "./polaroids.controller";

const router = Router();

router.get("/", getPolaroids);
router.get("/:id", getPolaroidById);
router.post(
  "/",
  authMiddleware,
  validateRequest(createPolaroidSchema),
  idempotencyMiddleware,
  createPolaroid,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updatePolaroidSchema),
  idempotencyMiddleware,
  updatePolaroid,
);
router.delete("/:id", authMiddleware, deletePolaroid);

export default router;
