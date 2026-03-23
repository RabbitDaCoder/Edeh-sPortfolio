import { db } from "../config/db";
import { redis } from "../config/redis";
import { mailService } from "./mail.service";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export type NotificationPayload = {
  type: string;
  title: string;
  message: string;
  link?: string;
  guestbookEntryId?: string;
  commentId?: string;
};

export const notificationService = {
  async create(payload: NotificationPayload) {
    const notification = await db.notification.create({
      data: {
        type: payload.type,
        title: payload.title,
        message: payload.message,
        link: payload.link,
        guestbookEntryId: payload.guestbookEntryId,
        commentId: payload.commentId,
      },
    });

    // Send admin email — fire and forget
    this.sendEmailNotification(payload).catch((err) =>
      logger.error({ err }, "Failed to send notification email"),
    );

    // Increment Redis unread counter for fast badge reads
    redis
      .incr("admin:notifications:unread")
      .catch((err) =>
        logger.error({ err }, "Failed to update Redis notification count"),
      );

    return notification;
  },

  async sendEmailNotification(payload: NotificationPayload) {
    const adminEmail = env.ADMIN_EMAIL;
    const dashboardUrl = Array.isArray(env.CORS_ORIGIN)
      ? env.CORS_ORIGIN[0]
      : env.CORS_ORIGIN;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; max-width: 560px; margin: 0 auto; border: 1px solid #e0e0e0; }
          .badge { display: inline-block; background: #080808; color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 99px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
          h2 { margin: 0 0 8px; font-size: 20px; color: #0a0a0a; }
          p { margin: 0 0 20px; color: #555; font-size: 15px; line-height: 1.6; }
          .btn { display: inline-block; background: #080808; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; }
          .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">${payload.type.replace(/_/g, " ")}</span>
          <h2>${payload.title}</h2>
          <p>${payload.message}</p>
          ${
            payload.link
              ? `<a href="${dashboardUrl}${payload.link}" class="btn">View in Dashboard &rarr;</a>`
              : ""
          }
          <div class="footer">
            This notification was sent from your portfolio platform.
          </div>
        </div>
      </body>
      </html>
    `;

    // Use the external email service (same pattern as contact emails)
    const url = `${env.EMAIL_SERVICE_URL}/api/send`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.EMAIL_SERVICE_API_KEY,
      },
      body: JSON.stringify({
        type: "notification",
        to: adminEmail,
        subject: `[Portfolio] ${payload.title}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Email service responded ${res.status}: ${body}`);
    }
  },

  async getAll(params: { read?: boolean; limit?: number; page?: number } = {}) {
    const limit = params.limit ?? 20;
    const skip = ((params.page ?? 1) - 1) * limit;

    const where = params.read !== undefined ? { read: params.read } : {};

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { read: false } }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getUnreadCount(): Promise<number> {
    try {
      const cached = await redis.get("admin:notifications:unread");
      if (cached !== null) return parseInt(cached, 10);
    } catch {
      /* fall through to DB */
    }

    const count = await db.notification.count({
      where: { read: false },
    });

    // Sync Redis with DB value
    redis.set("admin:notifications:unread", count.toString()).catch(() => {});

    return count;
  },

  async markRead(id: string) {
    const n = await db.notification.update({
      where: { id },
      data: { read: true },
    });

    redis.decr("admin:notifications:unread").catch(() => {});

    return n;
  },

  async markAllRead() {
    await db.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    redis.set("admin:notifications:unread", "0").catch(() => {});
  },

  async delete(id: string) {
    const n = await db.notification.findUnique({ where: { id } });
    // If deleting an unread notification, decrement counter
    if (n && !n.read) {
      redis.decr("admin:notifications:unread").catch(() => {});
    }
    return db.notification.delete({ where: { id } });
  },
};
