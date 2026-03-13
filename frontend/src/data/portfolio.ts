/* ═══════════════════════════════════════════════════════════════════════
   portfolio.ts — Single source of truth for all portfolio content.
   Every section component imports from here. Zero hardcoded strings.
   ═══════════════════════════════════════════════════════════════════════ */

// ─── Types ───────────────────────────────────────────────────────────
export interface Personal {
  name: { first: string; middle: string; last: string };
  tagline: string;
  bio: [string, string];
  pullQuote: string;
  availability: string;
  email: string;
  location: string;
  timezone: string;
  github: string;
  linkedin: string;
  youtube: string;
  twitter: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Lucide icon name (PascalCase) */
  icon: string;
}

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "3d"
  | "tools";

export interface Technology {
  name: string;
  category: TechCategory;
}

export interface Experience {
  id: string;
  role: string;
  organisation: string;
  period: string;
  description: string;
  type: "work" | "education" | "founder";
}

export interface Project {
  id: string;
  index: string;
  name: string;
  description: string;
  stack: string[];
  tags: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  typographicMark: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CvInfo {
  filename: string;
  publicPath: string;
  lastUpdated: string;
}

// ─── Category display labels ────────────────────────────────────────
export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  "3d": "3D & Creative",
  tools: "Tools",
};

// ─── PERSONAL ────────────────────────────────────────────────────────
export const PERSONAL: Personal = {
  name: { first: "Edeh", middle: "Chinedu", last: "Daniel" },
  tagline:
    "Full-stack engineer crafting performant, visually compelling web experiences with modern JavaScript, animations & 3D.",
  bio: [
    "I\u2019m Edeh Chinedu Daniel \u2014 a full-stack software engineer based in Nigeria, building web products that are fast, accessible and visually striking. I work across the entire stack, from Node.js APIs and PostgreSQL to React UIs with GSAP animation and Three.js 3D.",
    "My journey started at APTECH Computer Education, deepened at the University of Nigeria Nsukka (Computer Science), and continued through years of hands-on product work at companies like 8th Century Technologies and freelance engagements. I care about craft \u2014 clean architecture, smooth 60\u2009fps motion, and interfaces that feel intentional.",
  ],
  pullQuote: "Code is poetry. Make it beautiful, make it purposeful.",
  availability: "Available for work",
  email: "edehchinedu59@gmail.com",
  location: "Nigeria",
  timezone: "WAT / UTC+1",
  github: "https://github.com/Chinedu-E",
  linkedin: "https://linkedin.com/in/edeh-chinedu-daniel",
  youtube: "https://youtube.com/@edeh-chinedu",
  twitter: "https://twitter.com/edeh_chinedu",
};

// ─── SERVICES ────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description:
      "End-to-end web applications — React frontends, Node.js APIs, PostgreSQL databases, and cloud deployment.",
    icon: "Code2",
  },
  {
    id: "creative",
    title: "Creative & 3D Web",
    description:
      "Immersive browser experiences with Three.js, React Three Fiber, GSAP, and custom shaders.",
    icon: "Box",
  },
  {
    id: "systems",
    title: "Systems & IoT",
    description:
      "Hardware-software integration — ESP32 firmware, real-time dashboards, and sensor data pipelines.",
    icon: "Cpu",
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description:
      "Architecture reviews, performance audits, and mentoring for engineering teams.",
    icon: "MessageSquare",
  },
];

// ─── TECHNOLOGIES ────────────────────────────────────────────────────
export const TECHNOLOGIES: Technology[] = [
  // Frontend
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },
  { name: "Vite", category: "frontend" },
  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "Go", category: "backend" },
  { name: "REST API", category: "backend" },
  { name: "GraphQL", category: "backend" },
  // Database
  { name: "PostgreSQL", category: "database" },
  { name: "MongoDB", category: "database" },
  { name: "Redis", category: "database" },
  // DevOps
  { name: "Docker", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "Vercel", category: "devops" },
  { name: "AWS", category: "devops" },
  // 3D
  { name: "Three.js", category: "3d" },
  { name: "React Three Fiber", category: "3d" },
  { name: "GSAP", category: "3d" },
  { name: "Shader Writing", category: "3d" },
  // Tools
  { name: "Git", category: "tools" },
  { name: "Vitest", category: "tools" },
  { name: "ESLint", category: "tools" },
  { name: "Figma", category: "tools" },
];

// ─── EXPERIENCES ─────────────────────────────────────────────────────
export const EXPERIENCES: Experience[] = [
  {
    id: "8th-century",
    role: "Full-Stack Software Engineer",
    organisation: "8th Century Technologies",
    period: "2023 — Present",
    description:
      "Building scalable web applications and APIs. Led frontend architecture for internal products, integrated real-time features with Redis/BullMQ, and mentored junior developers.",
    type: "work",
  },
  {
    id: "freelance",
    role: "Freelance Software Engineer",
    organisation: "Self-Employed",
    period: "2022 — Present",
    description:
      "Delivering end-to-end web solutions for clients including logistics platforms (Aegis Express), IoT dashboards (HydroSense), and educational portals (VTE Faculty).",
    type: "work",
  },
  {
    id: "atueyi",
    role: "Web Developer",
    organisation: "Atueyi Ltd",
    period: "2021 — 2023",
    description:
      "Developed customer-facing web applications, improved frontend performance, and established coding standards and component library patterns across the team.",
    type: "work",
  },
  {
    id: "hydrosense",
    role: "Founder & Lead Engineer",
    organisation: "HydroSense",
    period: "2023 — Present",
    description:
      "Conceived and built an IoT-powered water automation system from scratch — ESP32 firmware, Go backend, React dashboard, and React Native mobile app.",
    type: "founder",
  },
  {
    id: "unn",
    role: "B.Sc. Computer Science",
    organisation: "University of Nigeria, Nsukka (UNN)",
    period: "2019 — 2024",
    description:
      "Core studies in algorithms, data structures, operating systems, and software engineering. Built the VTE Faculty portal as a capstone project.",
    type: "education",
  },
  {
    id: "aptech",
    role: "Diploma in Software Engineering",
    organisation: "APTECH Computer Education",
    period: "2018 — 2020",
    description:
      "Foundational training in programming, databases, networking, and web development. First exposure to full-stack development with Java, C#, and JavaScript.",
    type: "education",
  },
];

// ─── PROJECTS ────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "hydrosense",
    index: "01",
    name: "HydroSense",
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
  },
  {
    id: "aegis-express",
    index: "02",
    name: "Aegis Express",
    description:
      "Full-stack parcel logistics platform with authentication, admin dashboards, live delivery tracking, and RESTful API integrations.",
    stack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "REST API"],
    tags: ["featured", "fullstack"],
    featured: true,
    githubUrl: "https://github.com/Chinedu-E/aegis-express",
    typographicMark: "AEX",
  },
  {
    id: "vte-faculty",
    index: "03",
    name: "VTE Faculty Website",
    description:
      "Led a 6-person team to build the first version of the VTE faculty website. Managed UI design, Git collaboration, accessibility, and deployment.",
    stack: ["React.js", "Tailwind CSS", "Git"],
    tags: ["featured", "frontend"],
    featured: true,
    githubUrl: "https://github.com/Chinedu-E/vte-faculty",
    typographicMark: "UNN",
  },
  {
    id: "portfolio",
    index: "04",
    name: "Portfolio v2",
    description:
      "This very site — a production-grade React + Three.js portfolio with GSAP pinned card deck, cosmic 3D starfield, and a fully typed monorepo.",
    stack: ["React", "Three.js", "GSAP", "Tailwind CSS", "TypeScript"],
    tags: ["frontend", "3d"],
    featured: false,
    githubUrl: "https://github.com/Chinedu-E/portfolio-v2",
    typographicMark: "V.2",
  },
  {
    id: "hydrosense-mobile",
    index: "05",
    name: "HydroSense Mobile",
    description:
      "React Native companion app for the HydroSense IoT system — real-time alerts, reservoir controls, and billing management from your phone.",
    stack: ["React Native", "TypeScript", "Expo", "REST API"],
    tags: ["mobile", "iot"],
    featured: false,
    typographicMark: "H2M",
  },
  {
    id: "blog-engine",
    index: "06",
    name: "Blog Engine",
    description:
      "Markdown-powered blog with server-side rendering, syntax highlighting, reading time estimates, and RSS feed generation.",
    stack: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    tags: ["frontend", "fullstack"],
    featured: false,
    typographicMark: "BLG",
  },
  {
    id: "shader-lab",
    index: "07",
    name: "Shader Lab",
    description:
      "Collection of custom GLSL shaders and Three.js experiments — noise fields, particle systems, and procedural geometry.",
    stack: ["Three.js", "GLSL", "React Three Fiber", "TypeScript"],
    tags: ["3d", "creative"],
    featured: false,
    typographicMark: "SHD",
  },
  {
    id: "task-flow",
    index: "08",
    name: "TaskFlow",
    description:
      "Kanban-style project management tool with drag-and-drop, real-time collaboration via WebSockets, and role-based access control.",
    stack: ["React", "Node.js", "PostgreSQL", "Socket.io", "Docker"],
    tags: ["fullstack"],
    featured: false,
    typographicMark: "TFK",
  },
  {
    id: "devlinks",
    index: "09",
    name: "DevLinks",
    description:
      "Link-in-bio platform for developers with analytics, custom themes, and integration with GitHub profile data.",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    tags: ["fullstack"],
    featured: false,
    typographicMark: "DLK",
  },
  {
    id: "cli-scaffold",
    index: "10",
    name: "CLI Scaffold",
    description:
      "Node.js CLI tool that scaffolds opinionated project structures for React, Express, and full-stack monorepos with one command.",
    stack: ["Node.js", "TypeScript", "Commander.js"],
    tags: ["tools", "devtools"],
    featured: false,
    typographicMark: "CLI",
  },
];

// ─── TESTIMONIALS ────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Akin Oladele",
    role: "CTO",
    company: "8th Century Technologies",
    quote:
      "Chinedu consistently delivers production-quality code ahead of schedule. His ability to own both the frontend and backend makes him an invaluable part of our engineering team.",
  },
  {
    id: "t2",
    name: "Ngozi Obi",
    role: "Product Manager",
    company: "Atueyi Ltd",
    quote:
      "Working with Edeh was a game-changer. He translated complex requirements into clean, maintainable UIs and proactively suggested performance improvements that cut load times in half.",
  },
  {
    id: "t3",
    name: "Samuel Eze",
    role: "Senior Engineer",
    company: "Freelance Client",
    quote:
      "Edeh built our entire logistics platform from scratch and delivered it on time. His attention to detail in both code architecture and user experience is remarkable.",
  },
];

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "HydroSense IoT System",
    description:
      "Built a full IoT water-quality monitoring platform end-to-end — sensors to dashboard — for real-world municipal deployment.",
    date: "2024",
  },
  {
    id: "a2",
    title: "Aegis Express Launch",
    description:
      "Shipped a production logistics platform with live GPS tracking, automated dispatch, and a driver mobile interface.",
    date: "2023",
  },
  {
    id: "a3",
    title: "VTE Faculty Portal",
    description:
      "Developed an academic management system for the University of Nigeria, digitising course scheduling and result processing.",
    date: "2024",
  },
  {
    id: "a4",
    title: "Continuous Learner",
    description:
      "Completed advanced certifications in React, Node.js, and cloud infrastructure. Active technical writer and open-source contributor.",
    date: "2023",
  },
];

// ─── CV ──────────────────────────────────────────────────────────────
export const CV: CvInfo = {
  filename: "Edeh-Chinedu-Daniel-CV.pdf",
  publicPath: "/Edeh-Chinedu-Daniel-CV.pdf",
  lastUpdated: "2024-12",
};

// ─── NAV_LINKS ───────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "/projects" },
  { label: "Career", href: "#career" },
  { label: "Writing", href: "#blog" },
  { label: "Books", href: "#books" },
  { label: "Contact", href: "/contact" },
];
