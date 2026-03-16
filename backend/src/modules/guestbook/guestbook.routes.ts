import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import {
  getEntries,
  addEntry,
  getAllAdmin,
  approveEntry,
  pinEntry,
  flagEntry,
  deleteEntry,
} from "./guestbook.controller";

// ─── Validation Schemas ──────────────────────────────────────────────────────

const createEntrySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(280, "Message must be 280 characters or less"),
  handle: z.string().max(80).optional(),
});

// ─── Public Routes (/guestbook) ──────────────────────────────────────────────

export const publicGuestbookRouter = Router();

/**
 * @swagger
 * /api/v2/guestbook:
 *   get:
 *     summary: Get approved guestbook entries
 *     tags: [Guestbook]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         default: 1
 *     responses:
 *       200:
 *         description: Paginated list of approved entries
 */
publicGuestbookRouter.get("/", getEntries);

/**
 * @swagger
 * /api/v2/guestbook:
 *   post:
 *     summary: Submit a new guestbook entry
 *     tags: [Guestbook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *                 maxLength: 280
 *               handle:
 *                 type: string
 *                 maxLength: 80
 *     responses:
 *       201:
 *         description: Entry submitted for moderation
 */
publicGuestbookRouter.post("/", validateRequest(createEntrySchema), addEntry);

// ─── Admin Routes (/admin/guestbook) ─────────────────────────────────────────

export const adminGuestbookRouter = Router();
adminGuestbookRouter.use(authMiddleware);

/**
 * @swagger
 * /api/v2/admin/guestbook:
 *   get:
 *     summary: List all guestbook entries (admin)
 *     tags: [Guestbook Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: flagged
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Paginated admin list
 */
adminGuestbookRouter.get("/", getAllAdmin);

/**
 * @swagger
 * /api/v2/admin/guestbook/{id}/approve:
 *   patch:
 *     summary: Approve a guestbook entry
 *     tags: [Guestbook Admin]
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
 *         description: Entry approved
 */
adminGuestbookRouter.patch("/:id/approve", approveEntry);

/**
 * @swagger
 * /api/v2/admin/guestbook/{id}/pin:
 *   patch:
 *     summary: Toggle pin on a guestbook entry
 *     tags: [Guestbook Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pinned:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Pin toggled
 */
adminGuestbookRouter.patch("/:id/pin", pinEntry);

/**
 * @swagger
 * /api/v2/admin/guestbook/{id}/flag:
 *   patch:
 *     summary: Flag a guestbook entry
 *     tags: [Guestbook Admin]
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
 *         description: Entry flagged
 */
adminGuestbookRouter.patch("/:id/flag", flagEntry);

/**
 * @swagger
 * /api/v2/admin/guestbook/{id}:
 *   delete:
 *     summary: Delete a guestbook entry
 *     tags: [Guestbook Admin]
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
 *         description: Entry deleted
 */
adminGuestbookRouter.delete("/:id", deleteEntry);
