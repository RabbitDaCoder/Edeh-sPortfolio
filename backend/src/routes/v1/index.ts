import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes";
import blogRoutes from "../../modules/blog/blog.routes";
import articleRoutes from "../../modules/articles/articles.routes";
import bookRoutes from "../../modules/books/books.routes";
import careerRoutes from "../../modules/career/career.routes";
import achievementRoutes from "../../modules/achievements/achievements.routes";
import downloadRoutes from "../../modules/downloads/downloads.routes";
import contactRoutes from "../../modules/contact/contact.routes";
import newsletterRoutes from "../../modules/newsletter/newsletter.routes";
import projectRoutes from "../../modules/projects/projects.routes";
import skillRoutes from "../../modules/skills/skills.routes";
import testimonialRoutes from "../../modules/testimonials/testimonials.routes";
import profileRoutes from "../../modules/profile/profile.routes";
import uploadRoutes from "../../modules/upload/upload.routes";
import polaroidRoutes from "../../modules/polaroids/polaroids.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/articles", articleRoutes);
router.use("/books", bookRoutes);
router.use("/career", careerRoutes);
router.use("/achievements", achievementRoutes);
router.use("/downloads", downloadRoutes);
router.use("/contact", contactRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/projects", projectRoutes);
router.use("/skills", skillRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/profile", profileRoutes);
router.use("/upload", uploadRoutes);
router.use("/polaroids", polaroidRoutes);

export default router;
