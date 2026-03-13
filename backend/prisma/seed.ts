import { PrismaClient, TechCategory } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Seeding database...\n");

  // ── Admin user ─────────────────────────────────────────────────────
  const password = "Goodfave22@";
  const hashedPassword = await bcryptjs.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: "edehchinedu59@gmail.com" },
    update: { password: hashedPassword },
    create: {
      email: "edehchinedu59@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin seeded: ${user.email}`);

  // ── Site Profile ───────────────────────────────────────────────────
  const existingProfile = await prisma.siteProfile.findFirst();
  if (!existingProfile) {
    await prisma.siteProfile.create({
      data: {
        firstName: "Edeh",
        middleName: "Chinedu",
        lastName: "Daniel",
        tagline:
          "Full-stack engineer crafting performant, visually compelling web experiences with modern JavaScript, animations & 3D.",
        bio1: "I\u2019m Edeh Chinedu Daniel \u2014 a full-stack software engineer based in Nigeria, building web products that are fast, accessible and visually striking. I work across the entire stack, from Node.js APIs and PostgreSQL to React UIs with GSAP animation and Three.js 3D.",
        bio2: "My journey started at APTECH Computer Education, deepened at the University of Nigeria Nsukka (Computer Science), and continued through years of hands-on product work at companies like 8th Century Technologies and freelance engagements. I care about craft \u2014 clean architecture, smooth 60\u2009fps motion, and interfaces that feel intentional.",
        pullQuote: "Code is poetry. Make it beautiful, make it purposeful.",
        availability: "Available for work",
        email: "edehchinedu59@gmail.com",
        location: "Nigeria",
        timezone: "WAT / UTC+1",
        github: "https://github.com/Chinedu-E",
        linkedin: "https://linkedin.com/in/edeh-chinedu-daniel",
        youtube: "https://youtube.com/@edeh-chinedu",
        twitter: "https://twitter.com/edeh_chinedu",
      },
    });
    console.log("✓ Site profile seeded");
  } else {
    console.log("· Site profile already exists — skipped");
  }

  // ── Projects ───────────────────────────────────────────────────────
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const projects = [
      {
        name: "HydroSense",
        slug: "hydrosense",
        description:
          "IoT-powered water automation system with live dashboards for monitoring, billing, analytics, and reservoir automation. Built with React, TypeScript, Go, and ESP32 hardware.",
        stack: [
          "React",
          "TypeScript",
          "Go",
          "REST API",
          "React Native",
          "ESP32",
          "IoT",
        ],
        tags: ["featured", "fullstack", "iot"],
        featured: true,
        githubUrl: "https://github.com/Chinedu-E/hydrosense",
        typographicMark: "H2O",
        order: 1,
      },
      {
        name: "Aegis Express",
        slug: "aegis-express",
        description:
          "Full-stack parcel logistics platform with authentication, admin dashboards, live delivery tracking, and RESTful API integrations.",
        stack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "REST API"],
        tags: ["featured", "fullstack"],
        featured: true,
        githubUrl: "https://github.com/Chinedu-E/aegis-express",
        typographicMark: "AEX",
        order: 2,
      },
      {
        name: "VTE Faculty Website",
        slug: "vte-faculty",
        description:
          "Led a 6-person team to build the first version of the VTE faculty website. Managed UI design, Git collaboration, accessibility, and deployment.",
        stack: ["React.js", "Tailwind CSS", "Git"],
        tags: ["featured", "frontend"],
        featured: true,
        githubUrl: "https://github.com/Chinedu-E/vte-faculty",
        typographicMark: "UNN",
        order: 3,
      },
      {
        name: "Portfolio v2",
        slug: "portfolio-v2",
        description:
          "This very site — a production-grade React + Three.js portfolio with GSAP pinned card deck, cosmic 3D starfield, and a fully typed monorepo.",
        stack: ["React", "Three.js", "GSAP", "Tailwind CSS", "TypeScript"],
        tags: ["frontend", "3d"],
        featured: false,
        githubUrl: "https://github.com/Chinedu-E/portfolio-v2",
        typographicMark: "V.2",
        order: 4,
      },
      {
        name: "HydroSense Mobile",
        slug: "hydrosense-mobile",
        description:
          "React Native companion app for the HydroSense IoT system — real-time alerts, reservoir controls, and billing management from your phone.",
        stack: ["React Native", "TypeScript", "Expo", "REST API"],
        tags: ["mobile", "iot"],
        featured: false,
        typographicMark: "H2M",
        order: 5,
      },
      {
        name: "Blog Engine",
        slug: "blog-engine",
        description:
          "Markdown-powered blog with server-side rendering, syntax highlighting, reading time estimates, and RSS feed generation.",
        stack: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
        tags: ["frontend", "fullstack"],
        featured: false,
        typographicMark: "BLG",
        order: 6,
      },
      {
        name: "Shader Lab",
        slug: "shader-lab",
        description:
          "Collection of custom GLSL shaders and Three.js experiments — noise fields, particle systems, and procedural geometry.",
        stack: ["Three.js", "GLSL", "React Three Fiber", "TypeScript"],
        tags: ["3d", "creative"],
        featured: false,
        typographicMark: "SHD",
        order: 7,
      },
      {
        name: "TaskFlow",
        slug: "task-flow",
        description:
          "Kanban-style project management tool with drag-and-drop, real-time collaboration via WebSockets, and role-based access control.",
        stack: ["React", "Node.js", "PostgreSQL", "Socket.io", "Docker"],
        tags: ["fullstack"],
        featured: false,
        typographicMark: "TFK",
        order: 8,
      },
      {
        name: "DevLinks",
        slug: "devlinks",
        description:
          "Link-in-bio platform for developers with analytics, custom themes, and integration with GitHub profile data.",
        stack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
        tags: ["fullstack"],
        featured: false,
        typographicMark: "DLK",
        order: 9,
      },
      {
        name: "CLI Scaffold",
        slug: "cli-scaffold",
        description:
          "Node.js CLI tool that scaffolds opinionated project structures for React, Express, and full-stack monorepos with one command.",
        stack: ["Node.js", "TypeScript", "Commander.js"],
        tags: ["tools", "devtools"],
        featured: false,
        typographicMark: "CLI",
        order: 10,
      },
    ];

    for (const p of projects) {
      await prisma.project.create({ data: p });
    }
    console.log(`✓ ${projects.length} projects seeded`);
  } else {
    console.log(`· ${projectCount} projects already exist — skipped`);
  }

  // ── Skills / Technologies ──────────────────────────────────────────
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    const categoryMap: Record<string, TechCategory> = {
      frontend: "FRONTEND",
      backend: "BACKEND",
      database: "DATABASE",
      devops: "DEVOPS",
      "3d": "THREED",
      tools: "TOOLS",
    };

    const skills: { name: string; category: TechCategory; order: number }[] = [
      // Frontend
      { name: "React", category: "FRONTEND", order: 1 },
      { name: "TypeScript", category: "FRONTEND", order: 2 },
      { name: "Next.js", category: "FRONTEND", order: 3 },
      { name: "Tailwind CSS", category: "FRONTEND", order: 4 },
      { name: "Framer Motion", category: "FRONTEND", order: 5 },
      { name: "Vite", category: "FRONTEND", order: 6 },
      // Backend
      { name: "Node.js", category: "BACKEND", order: 7 },
      { name: "Express", category: "BACKEND", order: 8 },
      { name: "Go", category: "BACKEND", order: 9 },
      { name: "REST API", category: "BACKEND", order: 10 },
      { name: "GraphQL", category: "BACKEND", order: 11 },
      // Database
      { name: "PostgreSQL", category: "DATABASE", order: 12 },
      { name: "MongoDB", category: "DATABASE", order: 13 },
      { name: "Redis", category: "DATABASE", order: 14 },
      // DevOps
      { name: "Docker", category: "DEVOPS", order: 15 },
      { name: "GitHub Actions", category: "DEVOPS", order: 16 },
      { name: "Vercel", category: "DEVOPS", order: 17 },
      { name: "AWS", category: "DEVOPS", order: 18 },
      // 3D & Creative
      { name: "Three.js", category: "THREED", order: 19 },
      { name: "React Three Fiber", category: "THREED", order: 20 },
      { name: "GSAP", category: "THREED", order: 21 },
      { name: "Shader Writing", category: "THREED", order: 22 },
      // Tools
      { name: "Git", category: "TOOLS", order: 23 },
      { name: "Vitest", category: "TOOLS", order: 24 },
      { name: "ESLint", category: "TOOLS", order: 25 },
      { name: "Figma", category: "TOOLS", order: 26 },
    ];

    for (const s of skills) {
      await prisma.skill.create({ data: s });
    }
    console.log(`✓ ${skills.length} skills seeded`);
  } else {
    console.log(`· ${skillCount} skills already exist — skipped`);
  }

  // ── Testimonials ───────────────────────────────────────────────────
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonials = [
      {
        name: "Akin Oladele",
        role: "CTO",
        company: "8th Century Technologies",
        quote:
          "Chinedu consistently delivers production-quality code ahead of schedule. His ability to own both the frontend and backend makes him an invaluable part of our engineering team.",
        order: 1,
      },
      {
        name: "Ngozi Obi",
        role: "Product Manager",
        company: "Atueyi Ltd",
        quote:
          "Working with Edeh was a game-changer. He translated complex requirements into clean, maintainable UIs and proactively suggested performance improvements that cut load times in half.",
        order: 2,
      },
      {
        name: "Samuel Eze",
        role: "Senior Engineer",
        company: "Freelance Client",
        quote:
          "Edeh built our entire logistics platform from scratch and delivered it on time. His attention to detail in both code architecture and user experience is remarkable.",
        order: 3,
      },
    ];

    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }
    console.log(`✓ ${testimonials.length} testimonials seeded`);
  } else {
    console.log(`· ${testimonialCount} testimonials already exist — skipped`);
  }

  // ── Career Timeline (Experiences) ─────────────────────────────────
  const careerCount = await prisma.careerTimeline.count();
  if (careerCount === 0) {
    const careers = [
      {
        type: "JOB" as const,
        title: "Full-Stack Software Engineer",
        organisation: "8th Century Technologies",
        description:
          "Building scalable web applications and APIs. Led frontend architecture for internal products, integrated real-time features with Redis/BullMQ, and mentored junior developers.",
        startDate: new Date("2023-01-01"),
        current: true,
        order: 1,
      },
      {
        type: "FREELANCE" as const,
        title: "Freelance Software Engineer",
        organisation: "Self-Employed",
        description:
          "Delivering end-to-end web solutions for clients including logistics platforms (Aegis Express), IoT dashboards (HydroSense), and educational portals (VTE Faculty).",
        startDate: new Date("2022-01-01"),
        current: true,
        order: 2,
      },
      {
        type: "JOB" as const,
        title: "Web Developer",
        organisation: "Atueyi Ltd",
        description:
          "Developed customer-facing web applications, improved frontend performance, and established coding standards and component library patterns across the team.",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2023-01-01"),
        current: false,
        order: 3,
      },
      {
        type: "JOB" as const,
        title: "Founder & Lead Engineer",
        organisation: "HydroSense",
        description:
          "Conceived and built an IoT-powered water automation system from scratch — ESP32 firmware, Go backend, React dashboard, and React Native mobile app.",
        startDate: new Date("2023-01-01"),
        current: true,
        order: 4,
      },
      {
        type: "EDUCATION" as const,
        title: "B.Sc. Computer Science",
        organisation: "University of Nigeria, Nsukka (UNN)",
        description:
          "Core studies in algorithms, data structures, operating systems, and software engineering. Built the VTE Faculty portal as a capstone project.",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2024-06-01"),
        current: false,
        order: 5,
      },
      {
        type: "EDUCATION" as const,
        title: "Diploma in Software Engineering",
        organisation: "APTECH Computer Education",
        description:
          "Foundational training in programming, databases, networking, and web development. First exposure to full-stack development with Java, C#, and JavaScript.",
        startDate: new Date("2018-01-01"),
        endDate: new Date("2020-12-01"),
        current: false,
        order: 6,
      },
    ];

    for (const c of careers) {
      await prisma.careerTimeline.create({ data: c });
    }
    console.log(`✓ ${careers.length} career entries seeded`);
  } else {
    console.log(`· ${careerCount} career entries already exist — skipped`);
  }

  // ── Achievements ───────────────────────────────────────────────────
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    const achievements = [
      {
        title: "HydroSense IoT System",
        description:
          "Built a full IoT water-quality monitoring platform end-to-end — sensors to dashboard — for real-world municipal deployment.",
        date: new Date("2024-01-01"),
      },
      {
        title: "Aegis Express Launch",
        description:
          "Shipped a production logistics platform with live GPS tracking, automated dispatch, and a driver mobile interface.",
        date: new Date("2023-01-01"),
      },
      {
        title: "VTE Faculty Portal",
        description:
          "Developed an academic management system for the University of Nigeria, digitising course scheduling and result processing.",
        date: new Date("2024-01-01"),
      },
      {
        title: "Continuous Learner",
        description:
          "Completed advanced certifications in React, Node.js, and cloud infrastructure. Active technical writer and open-source contributor.",
        date: new Date("2023-01-01"),
      },
    ];

    for (const a of achievements) {
      await prisma.achievement.create({ data: a });
    }
    console.log(`✓ ${achievements.length} achievements seeded`);
  } else {
    console.log(`· ${achievementCount} achievements already exist — skipped`);
  }

  // ── Blog Posts ─────────────────────────────────────────────────────
  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    const blogs = [
      {
        title: "Mastering GSAP ScrollTrigger for Web Animations",
        slug: "mastering-gsap-scrolltrigger",
        content:
          "Deep dive into advanced scroll-triggered animations with practical examples.",
        excerpt:
          "Deep dive into advanced scroll-triggered animations with practical examples.",
        readTime: 8,
        tags: ["Animation", "GSAP", "JavaScript"],
        published: false,
      },
      {
        title: "Building 3D Web Experiences with React Three Fiber",
        slug: "building-3d-web-experiences-r3f",
        content:
          "Learn how to integrate Three.js into your React applications efficiently.",
        excerpt:
          "Learn how to integrate Three.js into your React applications efficiently.",
        readTime: 12,
        tags: ["3D", "React", "Three.js"],
        published: false,
      },
      {
        title: "TypeScript Best Practices in Modern React",
        slug: "typescript-best-practices-react",
        content:
          "Type safety patterns and strategies for large-scale React apps.",
        excerpt:
          "Type safety patterns and strategies for large-scale React apps.",
        readTime: 10,
        tags: ["TypeScript", "React"],
        published: false,
      },
      {
        title: "Performance Optimization Techniques",
        slug: "performance-optimization-techniques",
        content:
          "Practical strategies to improve Core Web Vitals and user experience.",
        excerpt:
          "Practical strategies to improve Core Web Vitals and user experience.",
        readTime: 9,
        tags: ["Performance", "Web Vitals"],
        published: false,
      },
      {
        title: "Design Systems at Scale",
        slug: "design-systems-at-scale",
        content:
          "Building and maintaining component libraries for enterprise applications.",
        excerpt:
          "Building and maintaining component libraries for enterprise applications.",
        readTime: 11,
        tags: ["Design", "Component Libraries"],
        published: false,
      },
      {
        title: "Modern CSS Animation Techniques",
        slug: "modern-css-animation-techniques",
        content:
          "Explore CSS-in-JS, keyframes, and advanced animation patterns.",
        excerpt:
          "Explore CSS-in-JS, keyframes, and advanced animation patterns.",
        readTime: 7,
        tags: ["CSS", "Animation"],
        published: false,
      },
    ];

    for (const b of blogs) {
      await prisma.blog.create({ data: b });
    }
    console.log(`✓ ${blogs.length} blog posts seeded`);
  } else {
    console.log(`· ${blogCount} blog posts already exist — skipped`);
  }

  // ── Books ──────────────────────────────────────────────────────────
  const bookCount = await prisma.book.count();
  if (bookCount === 0) {
    const books = [
      {
        title: "The Web Development Handbook",
        slug: "web-development-handbook",
        description:
          "A comprehensive guide to modern web development practices and patterns.",
        price: 0,
        published: false,
      },
      {
        title: "Animation Mastery",
        slug: "animation-mastery",
        description:
          "Advanced techniques for creating stunning web animations.",
        price: 0,
        published: false,
      },
      {
        title: "TypeScript in Action",
        slug: "typescript-in-action",
        description:
          "Practical TypeScript patterns for building scalable applications.",
        price: 0,
        published: false,
      },
      {
        title: "3D Web Graphics",
        slug: "3d-web-graphics",
        description:
          "Creating immersive 3D experiences on the web with Three.js and WebGL.",
        price: 0,
        published: false,
      },
      {
        title: "Performance Deep Dive",
        slug: "performance-deep-dive",
        description:
          "Optimization strategies for high-performance web applications.",
        price: 0,
        published: false,
      },
      {
        title: "Design Systems Guide",
        slug: "design-systems-guide",
        description: "Building consistent and scalable component libraries.",
        price: 0,
        published: false,
      },
    ];

    for (const b of books) {
      await prisma.book.create({ data: b });
    }
    console.log(`✓ ${books.length} books seeded`);
  } else {
    console.log(`· ${bookCount} books already exist — skipped`);
  }

  // ── Downloads (CV) ─────────────────────────────────────────────────
  const downloadCount = await prisma.download.count();
  if (downloadCount === 0) {
    await prisma.download.create({
      data: {
        label: "Edeh-Chinedu-Daniel-CV.pdf",
        fileUrl: "/Edeh-Chinedu-Daniel-CV.pdf",
        version: "2024-12",
        active: true,
      },
    });
    console.log("✓ CV download seeded");
  } else {
    console.log(`· ${downloadCount} downloads already exist — skipped`);
  }

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
