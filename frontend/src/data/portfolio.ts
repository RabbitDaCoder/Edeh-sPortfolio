/**
 * src/data/portfolio.ts
 *
 * Single source of truth for all portfolio content.
 * Every section component imports from here.
 * No hardcoded strings anywhere in components.
 *
 * Last updated: March 2026
 * Sources:
 *   - Resume PDF (uploaded March 2026)
 *   - GitHub: github.com/RabbitDaCoder (repos read March 2026)
 *   - GitHub: RabbitDaCoder/Amanpulo README
 *   - GitHub: RabbitDaCoder/StarkDCA README
 *
 * Change log:
 *   - Stack updated: now PERN (PostgreSQL, Express, React, Node)
 *   - DevOps added as skill category + services
 *   - AI Engineering added to services
 *   - Tagline updated to Full-Stack / Software Engineer
 *   - APTECH expanded: Java, C, C#, Dart, Flutter, PHP, Python, IoT, Web
 *   - Atueyi expanded: React + TypeScript focus
 *   - StarkDCA added: blockchain startup, Cairo, Starknet, co-founder role
 *   - Amanpulo added: luxury hotel reservation system (freelance)
 *   - Cairo developer certificate from Gida added to achievements
 *   - Most projects tagged as freelance/referral
 *   - PERN stack skills updated throughout
 */

// ─────────────────────────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "career", label: "Career" },
  { id: "achievements", label: "Achievements" },
  { id: "blog", label: "Writing" },
  { id: "books", label: "Books" },
  { id: "call", label: "Call" },
  { id: "cv", label: "CV" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PERSONAL INFO
// ─────────────────────────────────────────────────────────────────────────────

export const PERSONAL = {
  name: "Edeh Chinedu Daniel",
  alias: "RabbitDaCoder",

  // Updated: PERN stack + Software Engineer identity
  tagline: "Full-Stack Engineer & Software Developer",
  subTagline: "PERN Stack · React · TypeScript · DevOps · Blockchain",
  fullHeadline:
    "Full-Stack Software Engineer | PERN Stack | React & TypeScript | " +
    "DevOps | Blockchain (Cairo / Starknet) | IoT",

  bio: [
    "I build digital experiences that live at the intersection of " +
      "engineering and design. From IoT water systems to blockchain " +
      "startups and luxury hotel platforms, I approach every project " +
      "with the same obsession for craft and detail.",
    "Currently pursuing a B.Sc. in Computer and Robotics Education at " +
      "the University of Nigeria, Nsukka, while running DroineTech — a " +
      "tech agency delivering web, mobile, and robotics solutions for " +
      "clients across Nigeria and the UK.",
  ],

  pullQuote: "I believe great software should feel as good as it works.",
  availability: "Available for new projects",

  email: "edehchinedu59@gmail.com",
  phone: "+234 803 702 0923",
  location: "MaryLand Estate, Enugu, Enugu State 400102, Nigeria",
  locationShort: "Enugu, Nigeria",

  github: "https://github.com/RabbitDaCoder",
  linkedin: "https://www.linkedin.com/in/edehchinedu20",
  twitter: "https://x.com/EdehChinedu20",
  youtube: "https://youtube.com/@RabbitDaCoder",
  portfolio: "https://edehchinedu.dev",
  calendly: "https://calendly.com/edehchinedu59",

  languages: [
    { name: "English", level: "Fluent" },
    { name: "Igbo", level: "Fluent" },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
//  SKILLS / TECHNOLOGIES
//  Updated: PERN stack, DevOps, Cairo/Starknet, more languages from APTECH
// ─────────────────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "frontend"
  | "backend"
  | "state"
  | "database"
  | "devops"
  | "tools"
  | "3d"
  | "blockchain"
  | "other"
  | "languages";

export type Technology = {
  name: string;
  category: SkillCategory;
  fromResume?: boolean;
};

export const TECHNOLOGIES: Technology[] = [
  // ── Frontend ──────────────────────────────────────────
  { name: "React.js", category: "frontend", fromResume: true },
  { name: "Next.js", category: "frontend", fromResume: true },
  { name: "TypeScript", category: "frontend", fromResume: true },
  { name: "JavaScript (ES6+)", category: "frontend", fromResume: true },
  { name: "Tailwind CSS", category: "frontend", fromResume: true },
  { name: "Framer Motion", category: "frontend", fromResume: true },
  { name: "HTML5", category: "frontend", fromResume: false },
  { name: "CSS3", category: "frontend", fromResume: false },
  { name: "SCSS", category: "frontend", fromResume: false },
  { name: "GSAP", category: "frontend", fromResume: false },

  // ── Backend (PERN stack updated) ─────────────────────
  { name: "Node.js", category: "backend", fromResume: true },
  { name: "Express.js", category: "backend", fromResume: true },
  { name: "PostgreSQL", category: "backend", fromResume: true }, // PERN
  { name: "MongoDB", category: "backend", fromResume: true },
  { name: "Go", category: "backend", fromResume: true },
  { name: "Python", category: "backend", fromResume: false },
  { name: "Django", category: "backend", fromResume: false },
  { name: "PHP", category: "backend", fromResume: false }, // from APTECH
  { name: "BullMQ", category: "backend", fromResume: false },
  { name: "Prisma ORM", category: "backend", fromResume: false },

  // ── Programming Languages (from APTECH) ──────────────
  { name: "Java", category: "languages", fromResume: false },
  { name: "C", category: "languages", fromResume: false },
  { name: "C#", category: "languages", fromResume: false },
  { name: "Dart", category: "languages", fromResume: false },
  { name: "Flutter", category: "languages", fromResume: false },

  // ── Blockchain (from StarkDCA) ────────────────────────
  { name: "Cairo", category: "blockchain", fromResume: false },
  { name: "Starknet", category: "blockchain", fromResume: false },
  { name: "Starknet.js", category: "blockchain", fromResume: false },
  { name: "Smart Contracts", category: "blockchain", fromResume: false },
  { name: "Web3", category: "blockchain", fromResume: false },

  // ── State Management ──────────────────────────────────
  { name: "Redux", category: "state", fromResume: true },
  { name: "Zustand", category: "state", fromResume: true },
  { name: "React Query", category: "state", fromResume: true },
  { name: "TanStack Query", category: "state", fromResume: false },

  // ── Database ──────────────────────────────────────────
  { name: "PostgreSQL", category: "database", fromResume: true },
  { name: "MongoDB", category: "database", fromResume: true },
  { name: "Redis", category: "database", fromResume: false },
  { name: "MySQL", category: "database", fromResume: false },
  { name: "Firebase", category: "database", fromResume: false },

  // ── DevOps (new category) ─────────────────────────────
  { name: "Docker", category: "devops", fromResume: false },
  { name: "GitHub Actions", category: "devops", fromResume: false },
  { name: "Vercel", category: "devops", fromResume: false },
  { name: "Render", category: "devops", fromResume: false },
  { name: "CI/CD Pipelines", category: "devops", fromResume: false },
  { name: "Nginx", category: "devops", fromResume: false },

  // ── Tools ─────────────────────────────────────────────
  { name: "Git", category: "tools", fromResume: true },
  { name: "GitHub", category: "tools", fromResume: true },
  { name: "Postman", category: "tools", fromResume: true },
  { name: "Figma", category: "tools", fromResume: true },
  { name: "Agile", category: "tools", fromResume: true },
  { name: "Arduino", category: "tools", fromResume: false },

  // ── 3D / Creative ─────────────────────────────────────
  { name: "Three.js", category: "3d", fromResume: false },
  { name: "React Three Fiber", category: "3d", fromResume: false },

  // ── Other ─────────────────────────────────────────────
  { name: "REST APIs", category: "other", fromResume: true },
  { name: "API Integration", category: "other", fromResume: true },
  { name: "Authentication", category: "other", fromResume: true },
  { name: "Responsive UI", category: "other", fromResume: true },
  { name: "Testing", category: "other", fromResume: true },
  { name: "Documentation", category: "other", fromResume: true },
  { name: "IoT", category: "other", fromResume: true },
  { name: "ESP32", category: "other", fromResume: false },
  { name: "JWT Auth", category: "other", fromResume: false },
];

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  state: "State Management",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
  "3d": "3D & Creative",
  blockchain: "Blockchain & Web3",
  other: "Other",
  languages: "Programming Languages",
};

// ─────────────────────────────────────────────────────────────────────────────
//  SERVICES
//  Updated: DevOps and AI Engineering added
// ─────────────────────────────────────────────────────────────────────────────

export type Service = {
  title: string;
  description: string;
  icon: string;
};

export const SERVICES: Service[] = [
  {
    title: "Frontend Development",
    description:
      "Pixel-perfect, animated interfaces using React, TypeScript, Tailwind CSS, " +
      "Framer Motion, and GSAP. Modern JavaScript with performance-first thinking " +
      "and responsive design across all devices.",
    icon: "Monitor",
  },
  {
    title: "Full-Stack / PERN Engineering",
    description:
      "End-to-end applications built on PostgreSQL, Express, React, and Node.js. " +
      "REST APIs, JWT authentication, Prisma ORM, Redis caching, and cloud deployment " +
      "on Vercel and Render.",
    icon: "Globe",
  },
  {
    title: "DevOps & Infrastructure",
    description:
      "CI/CD pipelines with GitHub Actions, Docker containerisation, " +
      "environment management, and deployment automation. " +
      "Hosting on Vercel, Render, and cloud platforms.",
    icon: "Server",
  },
  {
    title: "AI Integration & Engineering",
    description:
      "Integrating AI models (Google Gemini, OpenAI) into production applications. " +
      "AI-powered content generation, prompt engineering, and building " +
      "intelligent features into full-stack platforms.",
    icon: "Sparkles",
  },
  {
    title: "IoT & Robotics Engineering",
    description:
      "IoT systems with ESP32 hardware, sensor integration, real-time dashboards, " +
      "and hardware-software bridging. Arduino, Go backends, and embedded " +
      "systems automation.",
    icon: "Cpu",
  },
  {
    title: "Technical Leadership",
    description:
      "Led multi-developer teams using Git collaboration, branch strategies, " +
      "code reviews, and agile workflows. Co-founded a blockchain startup " +
      "and delivered client projects under tight deadlines.",
    icon: "Users",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  EXPERIENCES / CAREER TIMELINE
//  Updated: StarkDCA co-founder role added, APTECH expanded
// ─────────────────────────────────────────────────────────────────────────────

export type TimelineType =
  | "education"
  | "work"
  | "freelance"
  | "founder"
  | "volunteer"
  | "plan"
  | "blockchain";

export type Experience = {
  id: string;
  type: TimelineType;
  title: string;
  organisation: string;
  date: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  points: string[];
  keySkills: string[];
  order: number;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "aptech",
    type: "education",
    title: "Software Engineering",
    organisation: "APTECH Computer Education",
    date: "Oct 2022 – Sept 2023",
    startDate: "2022-10-01",
    endDate: "2023-09-01",
    current: false,
    description:
      "Comprehensive software engineering training covering multiple " +
      "programming languages, IoT, web development, and systems design.",
    points: [
      "Studied Java, C, C#, Dart, and Flutter for multi-platform software development.",
      "Covered web development fundamentals: HTML, CSS, JavaScript, and PHP.",
      "Explored IoT systems, Python scripting, and embedded programming.",
      "Built foundational projects across web, desktop, and systems programming.",
      "Developed understanding of software architecture and engineering principles.",
    ],
    // Full language list from APTECH
    keySkills: [
      "Java",
      "C",
      "C#",
      "Dart",
      "Flutter",
      "PHP",
      "Python",
      "IoT",
      "Web Development",
    ],
    order: 1,
  },
  {
    id: "8th-century",
    type: "work",
    title: "Frontend Web Developer",
    organisation: "8th Century Tech",
    date: "July 2024 – Sept 2024",
    startDate: "2024-07-01",
    endDate: "2024-09-01",
    current: false,
    // Exact from resume
    description:
      "Rebuilt the company's corporate website using React.js, Tailwind CSS, " +
      "and Framer Motion, delivering a clean, modern, responsive interface. " +
      "Improved site performance, implemented animations, and collaborated " +
      "with a UK-based design team to refine user experience.",
    points: [
      "Rebuilt the company's corporate website using React.js, Tailwind CSS, and Framer Motion.",
      "Delivered a clean, modern, responsive interface under real client deadlines.",
      "Improved site performance and implemented animations throughout.",
      "Collaborated with a UK-based design team to refine user experience.",
      "Worked remotely, adapting to a high-paced, client-driven development cycle.",
    ],
    // Exact from resume Key Skills line
    keySkills: [
      "React.js",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive Design",
      "Git",
    ],
    order: 2,
  },
  {
    id: "atueyi",
    type: "education",
    title: "Frontend Web Development",
    organisation: "Atueyi Coding Academy",
    date: "Jan 2025 – Mar 2025",
    startDate: "2025-01-01",
    endDate: "2025-03-01",
    current: false,
    description:
      "Intensive React.js and TypeScript programme covering modern component " +
      "patterns, hooks, state management, and production-ready UI engineering.",
    points: [
      "Deep dive into React.js patterns, hooks, and component architecture.",
      "TypeScript type systems, generics, and strict-mode development.",
      "Built and shipped multiple production-ready React + TypeScript projects.",
      "Covered modern CSS with Tailwind and component-driven design.",
    ],
    keySkills: ["React.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS"],
    order: 3,
  },
  {
    id: "unn",
    type: "education",
    title: "B.Sc. Computer & Robotics Education",
    organisation: "University of Nigeria, Nsukka",
    date: "March 2025 – March 2028",
    startDate: "2025-03-01",
    endDate: "2028-03-01",
    current: true,
    description:
      "Undergraduate degree combining computer science fundamentals with " +
      "robotics engineering and embedded systems. Currently in progress.",
    points: [
      "Pursuing a B.Sc. in Computer and Robotics Education at UNN.",
      "Studying algorithms, data structures, robotics systems, and embedded programming.",
      "Applying academic knowledge through live projects at DroineTech and HydroSense.",
      "Balancing full-time academics with active software engineering work.",
    ],
    keySkills: [
      "Computer Science",
      "Robotics",
      "Embedded Systems",
      "Algorithms",
    ],
    order: 4,
  },
  {
    id: "vte",
    type: "work",
    title: "Full-Stack Developer (Lead)",
    organisation: "VTE Faculty Website — UNN Nsukka",
    date: "June 2025 – July 2025",
    startDate: "2025-06-01",
    endDate: "2025-07-01",
    current: false,
    description:
      "Led a 6-person team to develop the first version of the VTE faculty " +
      "website using React.js and Tailwind CSS. Managed UI design, Git " +
      "collaboration, accessibility, and deployment.",
    points: [
      "Led a 6-person team to develop the first version of the VTE faculty website.",
      "Managed UI design, Git collaboration, accessibility, and deployment.",
      "Used React.js, Tailwind CSS, Git, and a JSON-based content system.",
      "Coordinated tasks and resolved blockers across a distributed remote team.",
    ],
    keySkills: ["React.js", "Tailwind CSS", "Git", "JSON-based content"],
    order: 5,
  },
  {
    id: "starkdca",
    type: "blockchain",
    title: "Smart Contract Developer & Software Engineer (Co-Founder)",
    organisation: "StarkDCA",
    date: "2025 – Present",
    startDate: "2025-01-01",
    endDate: null,
    current: true,
    description:
      "Co-founded StarkDCA — an automated Bitcoin Dollar-Cost Averaging " +
      "platform on Starknet. Built Cairo smart contracts, a PERN + Redis " +
      "backend, and a React TypeScript frontend with Starknet wallet integration.",
    points: [
      "Co-founded StarkDCA, a non-custodial automated Bitcoin DCA platform on Starknet.",
      "Wrote Cairo smart contracts handling plan state, fund custody, and execution authorization.",
      "Earned a Cairo developer certificate from Gida through the StarkDCA build.",
      "Built the full backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, BullMQ.",
      "Built the frontend: React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, Starknet.js, Zustand.",
      "Implemented monorepo architecture: frontend, backend, email service, and Cairo contracts.",
      "Set up Docker containerisation, GitHub Actions CI/CD, and Render deployment.",
      "Live at starkdca.xyz — real users, real Bitcoin DCA automation on Starknet.",
    ],
    keySkills: [
      "Cairo",
      "Starknet",
      "Smart Contracts",
      "Starknet.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "Docker",
      "GitHub Actions",
      "Monorepo",
    ],
    order: 6,
  },
  {
    id: "droinetech",
    type: "founder",
    title: "Founder",
    organisation: "DroineTech",
    date: "July 2025 – Present",
    startDate: "2025-07-01",
    endDate: null,
    current: true,
    description:
      "Founded DroineTech, a tech agency delivering web, mobile, and robotics " +
      "solutions for non-tech clients across Nigeria and the UK. " +
      "Most work comes through freelance and referral.",
    points: [
      "Founded DroineTech — a tech agency building web, mobile, and robotics solutions.",
      "Delivered e-commerce sites, real estate portals, dashboards, and automation systems.",
      "Most projects sourced through freelance work and client referrals.",
      "Designed and deployed responsive UIs, REST APIs, and IoT-integrated apps.",
      "Stack: React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, Firebase, Arduino.",
    ],
    keySkills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Python",
      "Arduino",
      "Freelance",
    ],
    order: 7,
  },
  {
    id: "hydrosense-work",
    type: "work",
    title: "Lead Developer",
    organisation: "HydroSense",
    date: "July 2025 – Present",
    startDate: "2025-07-01",
    endDate: null,
    current: true,
    description:
      "Lead developer on HydroSense — an IoT-powered Smart Water Distribution " +
      "System using React TypeScript, Go, and ESP32 hardware.",
    points: [
      "Lead developer on the HydroSense IoT Smart Water Distribution System.",
      "Built dashboards for live water monitoring, billing, analytics, and reservoir automation.",
      "Integrated ESP32, sensors, flow meters, and GSM for real-time IoT control.",
      "Built cloud-based token system for monitoring, dispensing, and analytics.",
      "Building React Native mobile app for remote user interaction and payments.",
      "Collaborated on hardware testing, flow control, and safety validation.",
    ],
    keySkills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Go",
      "REST APIs",
      "React Native",
      "ESP32",
      "IoT",
    ],
    order: 8,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS
//  Updated: StarkDCA and Amanpulo added from GitHub
//  Most projects tagged freelance or referral as noted
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectType =
  | "personal"
  | "freelance"
  | "referral"
  | "startup"
  | "team"
  | "client";

export type Project = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  tags: string[];
  projectType: ProjectType;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  typographicMark: string;
  order: number;
};

export const PROJECTS: Project[] = [
  // ── Featured 1 ────────────────────────────────────────
  {
    id: "hydrosense",
    name: "HydroSense",
    description:
      "IoT-powered water automation system with live dashboards for " +
      "monitoring, billing, analytics, and reservoir automation.",
    longDescription:
      "Lead developer building an IoT-powered water automation system using " +
      "React (TypeScript), Go, Zustand, React Query, and ESP32 hardware. " +
      "Created dashboards for live water monitoring, billing, analytics, " +
      "and reservoir automation.",
    tags: [
      "React",
      "TypeScript",
      "Go",
      "ESP32",
      "IoT",
      "REST APIs",
      "React Native",
    ],
    projectType: "team",
    liveUrl: undefined,
    githubUrl: undefined,
    featured: true,
    typographicMark: "H2O",
    order: 1,
  },

  // ── Featured 2 ────────────────────────────────────────
  // From GitHub README — full stack blockchain startup
  {
    id: "starkdca",
    name: "StarkDCA",
    description:
      "Automated Bitcoin Dollar-Cost Averaging on Starknet. " +
      "Set your schedule, smart contracts execute the strategy.",
    longDescription:
      "Co-founded and built StarkDCA — a non-custodial automated Bitcoin DCA " +
      "platform on Starknet. Wrote Cairo smart contracts for plan management, " +
      "fund custody, and execution authorization. Built a full PERN + Redis " +
      "backend with BullMQ job scheduling, and a React TypeScript frontend " +
      "with Starknet wallet integration. Monorepo with Docker, GitHub Actions CI/CD, " +
      "and Vercel + Render deployment. Live at starkdca.xyz.",
    tags: [
      "Cairo",
      "Starknet",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "Docker",
      "GitHub Actions",
      "Starknet.js",
      "Zustand",
    ],
    projectType: "startup",
    liveUrl: "https://www.starkdca.xyz",
    githubUrl: "https://github.com/RabbitDaCoder/StarkDCA",
    featured: true,
    typographicMark: "DCA",
    order: 2,
  },

  // ── Featured 3 ────────────────────────────────────────
  // From GitHub README — luxury hotel reservation
  {
    id: "amanpulo",
    name: "Amanpulo Resort",
    description:
      "Full-stack luxury hotel reservation system with PDF receipts, " +
      "email confirmations, admin dashboard, and live chat support.",
    longDescription:
      "A full-stack MERN reservation system for Amanpulo Private Island Resort " +
      "featuring a premium booking experience with manual payment verification, " +
      "admin dashboard, PDF receipt generation via jsPDF + html2canvas, " +
      "email confirmations with Nodemailer, and Smartsupp live chat support. " +
      "React 19 + Vite frontend with Radix UI components, Zustand state management, " +
      "and a Node.js + Express + MongoDB backend. Deployed on Vercel + Render.",
    tags: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "Radix UI",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Nodemailer",
      "jsPDF",
      "Vercel",
      "Render",
    ],
    projectType: "freelance",
    liveUrl: "https://amanpuloresort.com",
    githubUrl: "https://github.com/RabbitDaCoder/Amanpulo",
    featured: true,
    typographicMark: "AMN",
    order: 3,
  },

  // ── Non-featured projects ──────────────────────────────
  {
    id: "aegis-express",
    name: "Aegis Express",
    description:
      "Parcel logistics platform with authentication, admin dashboards, " +
      "and live delivery tracking.",
    longDescription:
      "Built a parcel logistics platform with Next.js, Node.js, MongoDB, " +
      "and Tailwind CSS. Implemented authentication, admin dashboards, " +
      "live delivery tracking, and RESTful API integrations.",
    tags: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs"],
    projectType: "personal",
    liveUrl: undefined,
    githubUrl: undefined,
    featured: false,
    typographicMark: "AEX",
    order: 4,
  },
  {
    id: "vte-faculty",
    name: "VTE Faculty Website",
    description:
      "Led a 6-person team to build the first version of the VTE faculty website.",
    longDescription:
      "Led a 6-person team to develop the first version of the VTE faculty " +
      "website using React.js and Tailwind CSS. Managed UI design, Git " +
      "collaboration, accessibility, and deployment.",
    tags: ["React.js", "Tailwind CSS", "Git", "JSON-based content"],
    projectType: "client",
    liveUrl: "https://vte-website.netlify.app/",
    githubUrl: undefined,
    featured: false,
    typographicMark: "UNN",
    order: 5,
  },
  {
    id: "chychyagent",
    name: "ChyChyAgent",
    description:
      "Real estate and insurance platform with AI-powered blog management.",
    longDescription:
      "Full-stack platform for real estate listings, insurance plans, and " +
      "AI-powered blog content generation via Google Gemini. " +
      "Built with React, Node.js, MongoDB, and Redis.",
    tags: ["React", "Node.js", "MongoDB", "Zustand", "AI", "Redis"],
    projectType: "freelance",
    liveUrl: undefined,
    githubUrl: "https://github.com/RabbitDaCoder59/ChyChyAgent",
    featured: false,
    typographicMark: "CCA",
    order: 6,
  },
  {
    id: "ecommerce-mern",
    name: "E-Commerce MERN App",
    description:
      "Full MERN stack ecommerce with cart, checkout, and admin dashboard.",
    longDescription:
      "Full MERN stack ecommerce site with cart, checkout, and admin dashboard. " +
      "Built with React, Tailwind, and Zustand for state management.",
    tags: ["React", "Tailwind CSS", "Zustand", "MongoDB", "Node.js"],
    projectType: "personal",
    liveUrl: undefined,
    githubUrl: "https://github.com/RabbitDaCoder59/EcommerceWebApp",
    featured: false,
    typographicMark: "ECM",
    order: 7,
  },
  {
    id: "shopease",
    name: "Shopease",
    description:
      "Ecommerce platform with cart, pagination, and product filtering.",
    longDescription:
      "Ecommerce platform with cart, pagination, and product filtering. " +
      "Built with React, Zustand, and React Query.",
    tags: ["React", "Tailwind CSS", "React Query", "Zustand"],
    projectType: "personal",
    liveUrl: "https://shopease-lilac-omega.vercel.app/",
    githubUrl: undefined,
    featured: false,
    typographicMark: "SHE",
    order: 8,
  },
  {
    id: "8th-century-site",
    name: "8th Century Website",
    description:
      "Corporate website rebuild for a UK-based agency under real client deadlines.",
    longDescription:
      "Rebuilt the company's corporate website using React.js, Tailwind CSS, " +
      "and Framer Motion, delivering a clean, modern, responsive interface. " +
      "Improved site performance, implemented animations, and collaborated " +
      "with a UK-based design team.",
    tags: [
      "React.js",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive Design",
      "Git",
    ],
    projectType: "client",
    liveUrl: "https://8thcenturytech.com/",
    githubUrl: undefined,
    featured: false,
    typographicMark: "8TC",
    order: 9,
  },
  {
    id: "note-app",
    name: "Note App",
    description: "Notes app with authentication and profile management.",
    longDescription:
      "React + Tailwind app for creating, editing, and deleting notes " +
      "with authentication and profile management. " +
      "Backend API built with Node.js, Express, and MySQL.",
    tags: ["React", "Tailwind CSS", "Node.js", "Express", "MySQL"],
    projectType: "personal",
    liveUrl: "https://note-app-two-lake.vercel.app/",
    githubUrl: "https://github.com/RabbitDaCoder59/NoteApp_Server",
    featured: false,
    typographicMark: "NTA",
    order: 10,
  },
  {
    id: "irish-cafe",
    name: "Irish Cafe",
    description: "Landing page for a Florida Irish pub with event sections.",
    longDescription:
      "Landing page for Florida's top Irish Pub with events like " +
      "Pool Ball and Meetup Night. Built with HTML, CSS, and JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
    projectType: "freelance",
    liveUrl: "https://irish-cafe.vercel.app/",
    githubUrl: undefined,
    featured: false,
    typographicMark: "IRC",
    order: 11,
  },
  {
    id: "fresco",
    name: "Fresco",
    description: "Restaurant website with online ordering and clean UI.",
    longDescription:
      "Restaurant website where users can order beef steak and more. " +
      "Clean layout and UI built with HTML, CSS, and JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
    projectType: "freelance",
    liveUrl: "https://fresco-sigma.vercel.app/",
    githubUrl: undefined,
    featured: false,
    typographicMark: "FRS",
    order: 12,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  designation: string;
  company: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "maryann",
    quote:
      "I thought it was impossible to make a website as beautiful as our " +
      "product, but RabbitDaCoder proved me wrong.",
    name: "Eloike Maryann",
    designation: "CEO",
    company: "ChyChyAgent — Real Estate and Insurance Agency",
    initials: "EM",
  },
  {
    id: "chibuzo",
    quote:
      "I have never met a web developer who truly cares about their " +
      "clients success like RabbitDaCoder does.",
    name: "Chibuzo Daniel",
    designation: "School President",
    company: "VTE Faculty — UNN Nsukka",
    initials: "CD",
  },
  {
    id: "bonaventure",
    quote:
      "After RabbitDaCoder optimized our website, our traffic increased " +
      "by 50%. We cannot thank them enough.",
    name: "Mr Bonaventure",
    designation: "Product Manager",
    company: "8th Century Tech",
    initials: "MB",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  ACHIEVEMENTS
//  Updated: Cairo certificate from Gida added, StarkDCA launch added
// ─────────────────────────────────────────────────────────────────────────────

export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  order: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "starkdca-launch",
    title: "Co-Founded StarkDCA — Live Blockchain Startup",
    description:
      "Co-founded and shipped StarkDCA, a non-custodial automated Bitcoin DCA " +
      "platform on Starknet. Live at starkdca.xyz with real users executing " +
      "automated Bitcoin accumulation strategies on-chain.",
    date: "2025",
    order: 1,
  },
  {
    id: "cairo-certificate",
    title: "Cairo Developer Certificate — Gida",
    description:
      "Earned a Cairo developer certificate from Gida through building the " +
      "StarkDCA smart contracts. Cairo is the native language for Starknet " +
      "ZK-rollup smart contract development.",
    date: "2025",
    order: 2,
  },
  {
    id: "droinetech-founding",
    title: "Founded DroineTech",
    description:
      "Launched a tech agency delivering web, mobile, and robotics solutions " +
      "for non-tech clients across Nigeria and the UK. " +
      "Most work sourced through freelance and referral.",
    date: "July 2025",
    order: 3,
  },
  {
    id: "amanpulo-delivery",
    title: "Amanpulo Resort — Live Freelance Delivery",
    description:
      "Built and shipped a full-stack luxury hotel reservation system for " +
      "Amanpulo Private Island Resort — live at amanpuloresort.com. " +
      "Featured PDF receipts, email automation, and admin dashboard.",
    date: "2025",
    order: 4,
  },
  {
    id: "hydrosense-iot",
    title: "HydroSense — IoT Smart Water System",
    description:
      "Lead developer on an IoT water automation system integrating ESP32 " +
      "hardware, Go backend, React TypeScript dashboards, and real-time " +
      "sensor control for live monitoring and billing.",
    date: "July 2025",
    order: 5,
  },
  {
    id: "vte-lead",
    title: "Led 6-Person Dev Team — UNN",
    description:
      "Managed and shipped the VTE faculty website at UNN Nsukka with a " +
      "distributed team under a strict deadline using Git branch collaboration.",
    date: "June 2025",
    order: 6,
  },
  {
    id: "unn-admission",
    title: "Enrolled — UNN Computer & Robotics",
    description:
      "Enrolled in a B.Sc. in Computer and Robotics Education at the " +
      "University of Nigeria, Nsukka — balancing academics with active " +
      "agency and client work.",
    date: "March 2025",
    order: 7,
  },
  {
    id: "atueyi-completion",
    title: "Completed Atueyi Coding Academy",
    description:
      "Completed an intensive React.js and TypeScript programme, deepening " +
      "expertise in modern frontend engineering.",
    date: "March 2025",
    order: 8,
  },
  {
    id: "8th-century-remote",
    title: "Remote UK Placement — 8th Century Tech",
    description:
      "Secured a remote Frontend Web Developer role at 8th Century Tech (UK) " +
      "and delivered a full corporate website rebuild using React.js, " +
      "Tailwind CSS, and Framer Motion.",
    date: "July 2024",
    order: 9,
  },
  {
    id: "aptech-graduation",
    title: "APTECH Software Engineering",
    description:
      "Completed a comprehensive Software Engineering programme covering " +
      "Java, C, C#, Dart, Flutter, PHP, Python, IoT, and web development.",
    date: "September 2023",
    order: 10,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  CV / RESUME DOWNLOAD
// ─────────────────────────────────────────────────────────────────────────────

export const CV = {
  headline:
    "Full-Stack Software Engineer | PERN Stack | React & TypeScript | " +
    "DevOps | Blockchain (Cairo / Starknet) | IoT",
  label: "Curriculum Vitae",
  version: "v3.0",
  lastUpdated: "March 2026",
  filename: "Edeh-Chinedu-Daniel-CV.pdf",
} as const;

// ─────────────────────────────────────────────────────
//  HERO POLAROIDS
//  Photos that appear in the polaroid carousel on the
//  hero section. Replace src values with real Cloudinary
//  URLs when photos are available.
//  Rotation values are fixed per card — do not randomise
//  at runtime as it causes layout shift on re-render.
// ─────────────────────────────────────────────────────

export type Polaroid = {
  id: string;
  src: string; // Cloudinary URL or placeholder
  alt: string; // descriptive alt text
  caption: string; // handwritten-style label below
  rotation: number; // degrees, applied once at render
};

export const POLAROIDS: Polaroid[] = [
  {
    id: "p1",
    src: "", // replace with real photo URL
    alt: "Working on HydroSense IoT hardware",
    caption: "Building H2O",
    rotation: -4.2,
  },
  {
    id: "p2",
    src: "",
    alt: "Coding session late at night",
    caption: "Late night grind",
    rotation: 2.8,
  },
  {
    id: "p3",
    src: "",
    alt: "VTE team collaboration session",
    caption: "Team of six",
    rotation: -1.5,
  },
  {
    id: "p4",
    src: "",
    alt: "StarkDCA blockchain development",
    caption: "On-chain",
    rotation: 3.6,
  },
  {
    id: "p5",
    src: "",
    alt: "At a tech event or hackathon",
    caption: "In the field",
    rotation: -2.1,
  },
];
