import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { updateProfileSchema } from "./profile.schema";
import { getProfile, updateProfile } from "./profile.controller";

const router = Router();

router.get("/", getProfile);
router.patch(
  "/",
  authMiddleware,
  validateRequest(updateProfileSchema),
  idempotencyMiddleware,
  updateProfile,
);

export default router;
