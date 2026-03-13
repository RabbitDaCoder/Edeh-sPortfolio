import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { createCareerSchema, updateCareerSchema } from "./career.schema";
import {
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
} from "./career.controller";

const router = Router();

router.get("/", getCareer);
router.post(
  "/",
  authMiddleware,
  validateRequest(createCareerSchema),
  idempotencyMiddleware,
  createCareer,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateCareerSchema),
  idempotencyMiddleware,
  updateCareer,
);
router.delete("/:id", authMiddleware, deleteCareer);

export default router;
