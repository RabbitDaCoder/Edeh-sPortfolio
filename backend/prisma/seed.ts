import { PrismaClient, TechCategory, TimelineType } from "@prisma/client";

/**
 * Import portfolio data — the single source of truth.
 * This file lives in frontend/src/data/portfolio.ts but the seed script
 * can resolve it at build time via the relative path from backend/prisma/.
 */
import {
  EXPERIENCES,
  PROJECTS,
  TESTIMONIALS,
  ACHIEVEMENTS,
  TECHNOLOGIES,
  CV,
  POLAROIDS,
} from "../../frontend/src/data/portfolio";

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────────────────

/** Map portfolio SkillCategory string → Prisma TechCategory enum */
const CATEGORY_MAP: Record<string, TechCategory> = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  database: "DATABASE",
  devops: "DEVOPS",
  "3d": "THREED",
  tools: "TOOLS",
  state: "STATE",
  blockchain: "BLOCKCHAIN",
  other: "OTHER",
  languages: "LANGUAGES",
};

/** Map portfolio TimelineType string → Prisma TimelineType enum */
const TYPE_MAP: Record<string, TimelineType> = {
  education: "EDUCATION",
  work: "JOB",
  freelance: "FREELANCE",
  volunteer: "VOLUNTEER",
  plan: "PLAN",
  blockchain: "BLOCKCHAIN",
  founder: "FOUNDER",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("Seeding database...\n");

  // ── 1. Clear seeded tables (reverse FK order) ─────────────────────
  //    Only tables we seed from portfolio.ts — NOT User, Blog, Article,
  //    Book, Newsletter, ContactMessage, SiteProfile
  await prisma.testimonial.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.careerTimeline.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.download.deleteMany();
  await prisma.polaroid.deleteMany();
  console.log("✓ Cleared portfolio tables");

  // ── 2. Projects (from PROJECTS) ────────────────────────────────────
  for (const p of PROJECTS) {
    await prisma.project.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        longDescription: p.longDescription,
        stack: p.tags,
        tags: p.tags,
        projectType: p.projectType,
        featured: p.featured,
        liveUrl: p.liveUrl ?? null,
        githubUrl: p.githubUrl ?? null,
        typographicMark: p.typographicMark,
        order: p.order,
      },
    });
  }
  console.log(`✓ ${PROJECTS.length} projects seeded`);

  // ── 3. Skills / Technologies (from TECHNOLOGIES) ───────────────────
  let skillOrder = 0;
  for (const t of TECHNOLOGIES) {
    skillOrder++;
    const category = CATEGORY_MAP[t.category];
    if (!category) {
      console.warn(
        `⚠ Unknown category "${t.category}" for "${t.name}" — skipping`,
      );
      continue;
    }
    await prisma.skill.create({
      data: {
        name: t.name,
        category,
        order: skillOrder,
      },
    });
  }
  console.log(`✓ ${skillOrder} skills seeded`);

  // ── 4. Career Timeline (from EXPERIENCES) ──────────────────────────
  for (const e of EXPERIENCES) {
    const type = TYPE_MAP[e.type];
    if (!type) {
      console.warn(`⚠ Unknown type "${e.type}" for "${e.title}" — skipping`);
      continue;
    }
    await prisma.careerTimeline.create({
      data: {
        type,
        title: e.title,
        organisation: e.organisation,
        description: e.description,
        date: e.date,
        startDate: new Date(e.startDate),
        endDate: e.endDate ? new Date(e.endDate) : null,
        current: e.current,
        points: [...e.points],
        keySkills: [...e.keySkills],
        order: e.order,
      },
    });
  }
  console.log(`✓ ${EXPERIENCES.length} career entries seeded`);

  // ── 5. Testimonials (from TESTIMONIALS) ────────────────────────────
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        role: t.designation,
        designation: t.designation,
        company: t.company,
        quote: t.quote,
        initials: t.initials,
        order: TESTIMONIALS.indexOf(t) + 1,
      },
    });
  }
  console.log(`✓ ${TESTIMONIALS.length} testimonials seeded`);

  // ── 6. Achievements (from ACHIEVEMENTS) ────────────────────────────
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.create({
      data: {
        title: a.title,
        description: a.description,
        date: a.date,
        order: a.order,
      },
    });
  }
  console.log(`✓ ${ACHIEVEMENTS.length} achievements seeded`);

  // ── 7. Download / CV (from CV) ─────────────────────────────────────
  await prisma.download.create({
    data: {
      label: CV.filename,
      fileUrl: `/${CV.filename}`,
      version: CV.version,
      headline: CV.headline,
      lastUpdated: CV.lastUpdated,
      active: true,
    },
  });
  console.log("✓ CV download seeded");

  // ── 8. Polaroids (from POLAROIDS) ──────────────────────────────────
  for (const p of POLAROIDS) {
    await prisma.polaroid.create({
      data: {
        src: p.src,
        alt: p.alt,
        caption: p.caption,
        rotation: p.rotation,
        order: POLAROIDS.indexOf(p) + 1,
      },
    });
  }
  console.log(`✓ ${POLAROIDS.length} polaroids seeded`);

  console.log("\n✅ Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
