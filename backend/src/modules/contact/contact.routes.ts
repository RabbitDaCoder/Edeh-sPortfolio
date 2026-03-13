import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { contactLimiter } from "../../middleware/rateLimit";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { createContactSchema } from "./contact.schema";
import {
  submitContact,
  getMessages,
  markAsRead,
  deleteMessage,
} from "./contact.controller";

const router = Router();

router.post(
  "/",
  contactLimiter,
  validateRequest(createContactSchema),
  idempotencyMiddleware,
  submitContact,
);
router.get("/", authMiddleware, getMessages);
router.patch("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
