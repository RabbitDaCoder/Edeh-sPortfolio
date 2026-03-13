import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonials.schema";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonials.controller";

const router = Router();

router.get("/", getTestimonials);
router.post(
  "/",
  authMiddleware,
  validateRequest(createTestimonialSchema),
  idempotencyMiddleware,
  createTestimonial,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateTestimonialSchema),
  idempotencyMiddleware,
  updateTestimonial,
);
router.delete("/:id", authMiddleware, deleteTestimonial);

export default router;
