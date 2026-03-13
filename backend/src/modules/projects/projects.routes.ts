import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { createProjectSchema, updateProjectSchema } from "./projects.schema";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "./projects.controller";

const router = Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);
router.post(
  "/",
  authMiddleware,
  validateRequest(createProjectSchema),
  idempotencyMiddleware,
  createProject,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateProjectSchema),
  idempotencyMiddleware,
  updateProject,
);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
