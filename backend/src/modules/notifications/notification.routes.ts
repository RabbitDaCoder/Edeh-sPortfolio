import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
} from "./notification.controller";

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/v2/admin/notifications:
 *   get:
 *     summary: Get all notifications (admin)
 *     tags: [Notifications]
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
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: Paginated list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /api/v2/admin/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/unread-count", getUnreadCount);

/**
 * @swagger
 * /api/v2/admin/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch("/read-all", markAllRead);

/**
 * @swagger
 * /api/v2/admin/notifications/{id}/read:
 *   patch:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/read", markRead);

/**
 * @swagger
 * /api/v2/admin/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
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
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", deleteNotification);

export default router;
