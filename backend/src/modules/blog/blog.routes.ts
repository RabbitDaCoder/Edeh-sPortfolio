import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../../middleware/validate";
import { idempotencyMiddleware } from "../../middleware/idempotency";
import {
  createBlogSchema,
  updateBlogSchema,
  getBlogsQuerySchema,
} from "./blog.schema";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./blog.controller";
import { z } from "zod";

const router = Router();

/**
 * @swagger
 * /api/v1/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         default: 10
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", validateQuery(getBlogsQuerySchema), getBlogs);

/**
 * @swagger
 * /api/v1/blog/{slug}:
 *   get:
 *     summary: Get a single blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Blog post not found
 */
router.get("/:slug", getBlogBySlug);

/**
 * @swagger
 * /api/v1/blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, content]
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog post created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  validateRequest(createBlogSchema),
  idempotencyMiddleware,
  createBlog,
);

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   patch:
 *     summary: Update a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog post updated
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateBlogSchema),
  idempotencyMiddleware,
  updateBlog,
);

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
