import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import { subscribeNewsletterSchema } from "./newsletter.schema";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
} from "./newsletter.controller";

const router = Router();

router.post(
  "/subscribe",
  validateRequest(subscribeNewsletterSchema),
  idempotencyMiddleware,
  subscribe,
);
router.post("/unsubscribe/:email", unsubscribe);
router.get("/subscribers", authMiddleware, getSubscribers);

export default router;
