import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { swaggerSpec } from "./docs/swagger";
import { db } from "./config/db";
import v1Routes from "./routes/v1";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg) } }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(generalLimiter);

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const siteUrl = env.CORS_ORIGIN || "https://edehchinedu.dev";

      const [blogs, books] = await Promise.all([
        db.blog.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
          orderBy: { createdAt: "desc" },
        }),
        db.book.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const staticPages = [
        { loc: "/", priority: "1.0", changefreq: "weekly" },
        { loc: "/blog", priority: "0.9", changefreq: "daily" },
        { loc: "/books", priority: "0.8", changefreq: "weekly" },
        { loc: "/contact", priority: "0.6", changefreq: "monthly" },
      ];

      const urls = staticPages
        .map(
          (p) =>
            `  <url>\n    <loc>${siteUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
        )
        .concat(
          blogs.map(
            (b) =>
              `  <url>\n    <loc>${siteUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
          ),
        )
        .concat(
          books.map(
            (b) =>
              `  <url>\n    <loc>${siteUrl}/books/${b.slug}</loc>\n    <lastmod>${b.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
          ),
        );

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      logger.error(err, "Sitemap generation failed");
      res.status(500).send("Sitemap generation failed");
    }
  });

  app.use("/api/v1", v1Routes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  app.use(errorHandler);

  return app;
}
