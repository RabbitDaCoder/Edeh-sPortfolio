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
export declare const NAV_LINKS: readonly [{
    readonly id: "about";
    readonly label: "About";
}, {
    readonly id: "skills";
    readonly label: "Skills";
}, {
    readonly id: "work";
    readonly label: "Work";
}, {
    readonly id: "career";
    readonly label: "Career";
}, {
    readonly id: "achievements";
    readonly label: "Achievements";
}, {
    readonly id: "blog";
    readonly label: "Writing";
}, {
    readonly id: "books";
    readonly label: "Books";
}, {
    readonly id: "guestbook";
    readonly label: "Guestbook";
}];
export declare const PERSONAL: {
    readonly name: "Edeh Chinedu Daniel";
    readonly alias: "RabbitDaCoder";
    readonly tagline: "Full-Stack Engineer & Software Developer";
    readonly subTagline: "PERN Stack · React · TypeScript · DevOps · Blockchain";
    readonly fullHeadline: string;
    readonly bio: readonly [string, string];
    readonly pullQuote: "I believe great software should feel as good as it works.";
    readonly availability: "Available for new projects";
    readonly email: "edehchinedu59@gmail.com";
    readonly phone: "+234 803 702 0923";
    readonly location: "MaryLand Estate, Enugu, Enugu State 400102, Nigeria";
    readonly locationShort: "Enugu, Nigeria";
    readonly github: "https://github.com/RabbitDaCoder";
    readonly linkedin: "https://www.linkedin.com/in/edehchinedu20";
    readonly twitter: "https://x.com/EdehChinedu20";
    readonly youtube: "https://youtube.com/@RabbitDaCoder";
    readonly portfolio: "https://edehchinedu.dev";
    readonly calendly: "https://calendly.com/edehchinedu59";
    readonly languages: readonly [{
        readonly name: "English";
        readonly level: "Fluent";
    }, {
        readonly name: "Igbo";
        readonly level: "Fluent";
    }];
};
export type SkillCategory = "frontend" | "backend" | "state" | "database" | "devops" | "tools" | "3d" | "blockchain" | "other" | "languages";
export type Technology = {
    name: string;
    category: SkillCategory;
    fromResume?: boolean;
};
export declare const TECHNOLOGIES: Technology[];
export declare const SKILL_CATEGORY_LABELS: Record<SkillCategory, string>;
export type Service = {
    title: string;
    description: string;
    icon: string;
};
export declare const SERVICES: Service[];
export type TimelineType = "education" | "work" | "freelance" | "founder" | "volunteer" | "plan" | "blockchain";
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
export declare const EXPERIENCES: Experience[];
export type ProjectType = "personal" | "freelance" | "referral" | "startup" | "team" | "client";
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
export declare const PROJECTS: Project[];
export type Testimonial = {
    id: string;
    quote: string;
    name: string;
    designation: string;
    company: string;
    initials: string;
};
export declare const TESTIMONIALS: Testimonial[];
export type Achievement = {
    id: string;
    title: string;
    description: string;
    date: string;
    order: number;
};
export declare const ACHIEVEMENTS: Achievement[];
export declare const CV: {
    readonly headline: string;
    readonly label: "Curriculum Vitae";
    readonly version: "v3.0";
    readonly lastUpdated: "March 2026";
    readonly filename: "Edehs-Resume.pdf";
};
export type Polaroid = {
    id: string;
    src: string;
    alt: string;
    caption: string;
    rotation: number;
};
export declare const POLAROIDS: Polaroid[];
//# sourceMappingURL=portfolio.d.ts.map