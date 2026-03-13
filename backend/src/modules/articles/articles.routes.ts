import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest, validateQuery } from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import {
  createArticleSchema,
  updateArticleSchema,
  getArticlesQuerySchema,
} from "./articles.schema";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./articles.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get("/", validateQuery(getArticlesQuerySchema), getArticles);
router.get("/:slug", getArticleBySlug);
router.post(
  "/",
  authMiddleware,
  validateRequest(createArticleSchema),
  idempotencyMiddleware,
  createArticle,
);
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateArticleSchema),
  idempotencyMiddleware,
  updateArticle,
);
router.delete("/:id", authMiddleware, deleteArticle);

export default router;
