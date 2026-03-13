import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { createSkillSchema, updateSkillSchema } from "./skills.schema";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "./skills.controller";

const router = Router();

router.get("/", getSkills);
router.post(
  "/",
  authMiddleware,
  validateRequest(createSkillSchema),
  idempotencyMiddleware,
  createSkill,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateSkillSchema),
  idempotencyMiddleware,
  updateSkill,
);
router.delete("/:id", authMiddleware, deleteSkill);

export default router;
