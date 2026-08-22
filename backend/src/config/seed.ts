import { db } from "./db";
import {
  defaultAchievements,
  defaultBlogPosts,
  defaultBooks,
  defaultCareer,
  defaultDownloads,
  defaultPolaroids,
  defaultProfile,
  defaultProjects,
  defaultSkills,
  defaultTestimonials,
} from "./defaultContent";
import { logger } from "../utils/logger";

async function seedBySlug(model: any, records: Array<Record<string, unknown>>) {
  for (const record of records) {
    await model.upsert({
      where: { slug: record.slug },
      update: record,
      create: record,
    });
  }
  return records.length;
}

async function seedByName(model: any, records: Array<Record<string, unknown>>) {
  for (const record of records) {
    await model.upsert({
      where: { name: record.name },
      update: record,
      create: record,
    });
  }
  return records.length;
}

async function seedById(model: any, records: Array<Record<string, unknown>>) {
  for (const record of records) {
    const { id, ...data } = record;
    await model.upsert({
      where: { id },
      update: data,
      create: data,
    });
  }
  return records.length;
}

export async function seedDefaultContentIfEmpty(): Promise<void> {
  const [
    blogCount,
    bookCount,
    careerCount,
    achievementCount,
    downloadCount,
    projectCount,
    skillCount,
    testimonialCount,
    polaroidCount,
    profileCount,
  ] = await Promise.all([
    db.blog.count(),
    db.book.count(),
    db.careerTimeline.count(),
    db.achievement.count(),
    db.download.count(),
    db.project.count(),
    db.skill.count(),
    db.testimonial.count(),
    db.polaroid.count(),
    db.siteProfile.count(),
  ]);

  const restored = {
    profile: 0,
    projects: 0,
    skills: 0,
    career: 0,
    achievements: 0,
    testimonials: 0,
    polaroids: 0,
    downloads: 0,
    blogPosts: 0,
    books: 0,
  };

  if (profileCount === 0) {
    await db.siteProfile.create({ data: defaultProfile });
    restored.profile = 1;
  }
  if (projectCount === 0)
    restored.projects = await seedBySlug(db.project, defaultProjects);
  if (skillCount === 0)
    restored.skills = await seedByName(db.skill, defaultSkills);
  if (careerCount === 0)
    restored.career = await seedById(db.careerTimeline, defaultCareer);
  if (achievementCount === 0)
    restored.achievements = await seedById(db.achievement, defaultAchievements);
  if (testimonialCount === 0)
    restored.testimonials = await seedById(db.testimonial, defaultTestimonials);
  if (polaroidCount === 0)
    restored.polaroids = await seedById(db.polaroid, defaultPolaroids);
  if (downloadCount === 0)
    restored.downloads = await seedByName(db.download, defaultDownloads);
  if (blogCount === 0)
    restored.blogPosts = await seedBySlug(db.blog, defaultBlogPosts);
  if (bookCount === 0) restored.books = await seedBySlug(db.book, defaultBooks);

  logger.info(restored, "Default content seeded into empty database");
}
