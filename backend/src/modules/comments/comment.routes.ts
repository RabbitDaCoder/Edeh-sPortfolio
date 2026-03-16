import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest, validateQuery } from "../../middleware/validate";
import {
  createCommentSchema,
  getCommentsQuerySchema,
  adminCommentsQuerySchema,
} from "./comment.schema";
import {
  getComments,
  createComment,
  getAdminComments,
  approveComment,
  markCommentSpam,
  deleteComment,
  toggleBlogComments,
} from "./comment.controller";

// Public routes — mounted on /blog/:slug/comments
export const publicCommentRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/blog/{slug}/comments:
 *   get:
 *     summary: Get approved comments for a blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         default: 20
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Blog post not found
 */
publicCommentRouter.get(
  "/",
  validateQuery(getCommentsQuerySchema),
  getComments,
);

/**
 * @swagger
 * /api/v1/blog/{slug}/comments:
 *   post:
 *     summary: Submit a new comment on a blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, body]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               body:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment submitted for moderation
 *       403:
 *         description: Comments disabled
 *       404:
 *         description: Blog post not found
 */
publicCommentRouter.post(
  "/",
  validateRequest(createCommentSchema),
  createComment,
);

// Admin routes — mounted on /admin/comments
export const adminCommentRouter = Router();

/**
 * @swagger
 * /api/v1/admin/comments:
 *   get:
 *     summary: Get all comments (admin)
 *     tags: [Comments Admin]
 *     security:
 *       - bearerAuth: []
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
 *         default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, spam, all]
 *         default: pending
 *     responses:
 *       200:
 *         description: List of comments
 *       401:
 *         description: Unauthorized
 */
adminCommentRouter.get(
  "/",
  authMiddleware,
  validateQuery(adminCommentsQuerySchema),
  getAdminComments,
);

/**
 * @swagger
 * /api/v1/admin/comments/{id}/approve:
 *   patch:
 *     summary: Approve a comment
 *     tags: [Comments Admin]
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
 *         description: Comment approved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
adminCommentRouter.patch("/:id/approve", authMiddleware, approveComment);

/**
 * @swagger
 * /api/v1/admin/comments/{id}/spam:
 *   patch:
 *     summary: Mark a comment as spam
 *     tags: [Comments Admin]
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
 *         description: Comment marked as spam
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
adminCommentRouter.patch("/:id/spam", authMiddleware, markCommentSpam);

/**
 * @swagger
 * /api/v1/admin/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments Admin]
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
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
adminCommentRouter.delete("/:id", authMiddleware, deleteComment);

/**
 * @swagger
 * /api/v1/admin/comments/blog/{id}/toggle:
 *   patch:
 *     summary: Toggle comments enabled/disabled on a blog post
 *     tags: [Comments Admin]
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
 *         description: Comments toggled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 */
adminCommentRouter.patch(
  "/blog/:id/toggle",
  authMiddleware,
  toggleBlogComments,
);
