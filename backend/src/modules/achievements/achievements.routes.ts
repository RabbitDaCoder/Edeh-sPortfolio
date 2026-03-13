import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import {
  createAchievementSchema,
  updateAchievementSchema,
} from "./achievements.schema";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "./achievements.controller";

const router = Router();

router.get("/", getAchievements);
router.post(
  "/",
  authMiddleware,
  validateRequest(createAchievementSchema),
  idempotencyMiddleware,
  createAchievement,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateAchievementSchema),
  idempotencyMiddleware,
  updateAchievement,
);
router.delete("/:id", authMiddleware, deleteAchievement);

export default router;
