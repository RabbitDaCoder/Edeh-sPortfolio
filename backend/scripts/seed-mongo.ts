import { ensureAdminUser } from "../src/config/admin";
import { db, mongoClient } from "../src/config/db";
import {
  ACHIEVEMENTS,
  CV,
  EXPERIENCES,
  PERSONAL,
  POLAROIDS,
  PROJECTS,
  TECHNOLOGIES,
  TESTIMONIALS,
} from "../../frontend/src/data/portfolio";

const categoryMap: Record<string, string> = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  state: "STATE",
  database: "DATABASE",
  devops: "DEVOPS",
  tools: "TOOLS",
  "3d": "THREED",
  blockchain: "BLOCKCHAIN",
  other: "OTHER",
  languages: "LANGUAGES",
};

const timelineTypeMap: Record<string, string> = {
  education: "EDUCATION",
  work: "JOB",
  freelance: "FREELANCE",
  founder: "FOUNDER",
  volunteer: "VOLUNTEER",
  plan: "PLAN",
  blockchain: "BLOCKCHAIN",
};

async function seedProfile() {
  const existing = await db.siteProfile.findFirst();
  const data = {
    firstName: "Edeh",
    middleName: "Chinedu",
    lastName: "Daniel",
    alias: PERSONAL.alias,
    tagline: PERSONAL.tagline,
    subTagline: PERSONAL.subTagline,
    fullHeadline: PERSONAL.fullHeadline,
    bio1: PERSONAL.bio[0],
    bio2: PERSONAL.bio[1],
    pullQuote: PERSONAL.pullQuote,
    availability: PERSONAL.availability,
    email: PERSONAL.email,
    phone: PERSONAL.phone,
    location: PERSONAL.location,
    locationShort: PERSONAL.locationShort,
    timezone: "WAT / UTC+1",
    github: PERSONAL.github,
    linkedin: PERSONAL.linkedin,
    youtube: PERSONAL.youtube,
    twitter: PERSONAL.twitter,
    portfolio: PERSONAL.portfolio,
    calendly: PERSONAL.calendly,
  };

  if (existing) {
    await db.siteProfile.update({ where: { id: existing.id }, data });
    return 1;
  }

  await db.siteProfile.create({ data });
  return 1;
}

async function seedProjects() {
  for (const project of PROJECTS) {
    await db.project.upsert({
      where: { slug: project.id },
      update: {
        name: project.name,
        slug: project.id,
        description: project.description,
        longDescription: project.longDescription,
        stack: project.tags,
        tags: project.tags,
        projectType: project.projectType,
        featured: project.featured,
        liveUrl: project.liveUrl ?? null,
        githubUrl: project.githubUrl ?? null,
        typographicMark: project.typographicMark,
        order: project.order,
        published: true,
      },
      create: {
        name: project.name,
        slug: project.id,
        description: project.description,
        longDescription: project.longDescription,
        stack: project.tags,
        tags: project.tags,
        projectType: project.projectType,
        featured: project.featured,
        liveUrl: project.liveUrl ?? null,
        githubUrl: project.githubUrl ?? null,
        typographicMark: project.typographicMark,
        order: project.order,
        published: true,
      },
    });
  }

  return PROJECTS.length;
}

async function seedSkills() {
  for (const [index, skill] of TECHNOLOGIES.entries()) {
    await db.skill.upsert({
      where: { name: skill.name },
      update: {
        name: skill.name,
        category: categoryMap[skill.category] ?? "OTHER",
        order: index + 1,
      },
      create: {
        name: skill.name,
        category: categoryMap[skill.category] ?? "OTHER",
        order: index + 1,
      },
    });
  }

  return TECHNOLOGIES.length;
}

async function seedCareer() {
  for (const item of EXPERIENCES) {
    await db.careerTimeline.upsert({
      where: { id: item.id },
      update: {
        type: timelineTypeMap[item.type] ?? "JOB",
        title: item.title,
        organisation: item.organisation,
        description: item.description,
        date: item.date,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : null,
        current: item.current,
        points: item.points,
        keySkills: item.keySkills,
        order: item.order,
      },
      create: {
        type: timelineTypeMap[item.type] ?? "JOB",
        title: item.title,
        organisation: item.organisation,
        description: item.description,
        date: item.date,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : null,
        current: item.current,
        points: item.points,
        keySkills: item.keySkills,
        order: item.order,
      },
    });
  }

  return EXPERIENCES.length;
}

async function seedAchievements() {
  for (const item of ACHIEVEMENTS) {
    await db.achievement.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        date: item.date,
        order: item.order,
      },
      create: {
        title: item.title,
        description: item.description,
        date: item.date,
        order: item.order,
      },
    });
  }

  return ACHIEVEMENTS.length;
}

async function seedTestimonials() {
  for (const [index, item] of TESTIMONIALS.entries()) {
    await db.testimonial.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        role: item.designation,
        designation: item.designation,
        company: item.company,
        quote: item.quote,
        initials: item.initials,
        order: index + 1,
        published: true,
      },
      create: {
        name: item.name,
        role: item.designation,
        designation: item.designation,
        company: item.company,
        quote: item.quote,
        initials: item.initials,
        order: index + 1,
        published: true,
      },
    });
  }

  return TESTIMONIALS.length;
}

async function seedPolaroids() {
  for (const [index, item] of POLAROIDS.entries()) {
    await db.polaroid.upsert({
      where: { id: item.id },
      update: {
        src: item.src,
        alt: item.alt,
        caption: item.caption,
        rotation: item.rotation,
        order: index + 1,
        published: true,
      },
      create: {
        src: item.src,
        alt: item.alt,
        caption: item.caption,
        rotation: item.rotation,
        order: index + 1,
        published: true,
      },
    });
  }

  return POLAROIDS.length;
}

async function seedDownloads() {
  await db.download.upsert({
    where: { label: CV.filename },
    update: {
      label: CV.filename,
      fileUrl: `/${CV.filename}`,
      version: CV.version,
      headline: CV.headline,
      lastUpdated: CV.lastUpdated,
      active: true,
    },
    create: {
      label: CV.filename,
      fileUrl: `/${CV.filename}`,
      version: CV.version,
      headline: CV.headline,
      lastUpdated: CV.lastUpdated,
      active: true,
      downloads: 0,
    },
  });

  return 1;
}

async function seedBlogPosts() {
  const posts = [
    {
      title: "Mastering GSAP ScrollTrigger for Web Animations",
      slug: "mastering-gsap-scrolltrigger",
      content: "Deep dive into advanced scroll-triggered animations with practical examples.",
      excerpt: "Deep dive into advanced scroll-triggered animations with practical examples.",
      category: "Web Development",
      tags: ["Animation", "GSAP", "JavaScript"],
      readTime: 8,
    },
    {
      title: "Building 3D Web Experiences with React Three Fiber",
      slug: "building-3d-web-experiences-r3f",
      content: "Learn how to integrate Three.js into React applications efficiently.",
      excerpt: "Learn how to integrate Three.js into React applications efficiently.",
      category: "Web Development",
      tags: ["3D", "React", "Three.js"],
      readTime: 12,
    },
    {
      title: "TypeScript Best Practices in Modern React",
      slug: "typescript-best-practices-react",
      content: "Type safety patterns and strategies for large-scale React apps.",
      excerpt: "Type safety patterns and strategies for large-scale React apps.",
      category: "Web Development",
      tags: ["TypeScript", "React"],
      readTime: 10,
    },
  ];

  for (const post of posts) {
    await db.blog.upsert({
      where: { slug: post.slug },
      update: { ...post, published: false, featured: false, views: 0 },
      create: { ...post, published: false, featured: false, views: 0 },
    });
  }

  return posts.length;
}

async function seedBooks() {
  const books = [
    {
      title: "The Web Development Handbook",
      slug: "web-development-handbook",
      description: "A comprehensive guide to modern web development practices and patterns.",
    },
    {
      title: "Animation Mastery",
      slug: "animation-mastery",
      description: "Advanced techniques for creating polished web animations.",
    },
    {
      title: "TypeScript in Action",
      slug: "typescript-in-action",
      description: "Practical TypeScript patterns for building scalable applications.",
    },
  ];

  for (const book of books) {
    await db.book.upsert({
      where: { slug: book.slug },
      update: { ...book, price: 0, published: false, featured: false },
      create: { ...book, price: 0, published: false, featured: false },
    });
  }

  return books.length;
}

async function main() {
  const restored = {
    admin: 0,
    siteProfile: 0,
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

  await ensureAdminUser();
  restored.admin = 1;
  restored.siteProfile = await seedProfile();
  restored.projects = await seedProjects();
  restored.skills = await seedSkills();
  restored.career = await seedCareer();
  restored.achievements = await seedAchievements();
  restored.testimonials = await seedTestimonials();
  restored.polaroids = await seedPolaroids();
  restored.downloads = await seedDownloads();
  restored.blogPosts = await seedBlogPosts();
  restored.books = await seedBooks();

  console.log(JSON.stringify(restored, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
