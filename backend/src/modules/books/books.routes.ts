import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest, validateQuery } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import {
  createBookSchema,
  updateBookSchema,
  getBooksQuerySchema,
} from "./books.schema";
import {
  getBooks,
  getFeaturedBooks,
  getBookBySlug,
  createBook,
  updateBook,
  deleteBook,
  toggleBookFeatured,
} from "./books.controller";

const router = Router();

router.get("/", validateQuery(getBooksQuerySchema), getBooks);
router.get("/featured", getFeaturedBooks);
router.get("/:slug", getBookBySlug);
router.post(
  "/",
  authMiddleware,
  validateRequest(createBookSchema),
  idempotencyMiddleware,
  createBook,
);
router.patch("/:id/feature", authMiddleware, toggleBookFeatured);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateBookSchema),
  idempotencyMiddleware,
  updateBook,
);
router.delete("/:id", authMiddleware, deleteBook);

export default router;
