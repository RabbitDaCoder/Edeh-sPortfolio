import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { ProjectGridCard } from "../components/projects/ProjectGridCard";
import { PROJECTS } from "../data/portfolio";
import { useProjects } from "../features/projects/hooks/useProjects";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { breadcrumbSchema, collectionPageSchema } from "../lib/schemas";
export const ProjectsPage = () => {
    const { data: allProjects = PROJECTS } = useProjects();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeFilter = searchParams.get("filter") ?? "all";
    const allTags = useMemo(() => Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort(), [allProjects]);
    const filtered = useMemo(() => {
        if (activeFilter === "all")
            return allProjects;
        return allProjects.filter((p) => p.tags.includes(activeFilter));
    }, [activeFilter, allProjects]);
    const setFilter = (tag) => {
        if (tag === "all") {
            setSearchParams({});
        }
        else {
            setSearchParams({ filter: tag });
        }
    };
    const seo = useSEO({
        title: "Projects — Full-Stack Apps, IoT & Creative Experiments",
        description: "Browse projects by Edeh Chinedu Daniel — production platforms, " +
            "IoT systems, 3D experiments, and open-source developer tools " +
            "built with React, Node.js, Go, and Three.js.",
        canonical: "https://edehchinedu.dev/projects",
        ogType: "website",
        keywords: [
            "Edeh Chinedu Daniel Projects",
            "Full-Stack Portfolio Nigeria",
            "React Projects",
            "IoT Projects HydroSense",
            "RabbitDaCoder GitHub",
            "Three.js Experiments",
            "Open Source Nigeria",
        ],
    });
    return (_jsxs(PageWrapper, { title: "Projects | Edeh Chinedu Daniel", description: "Browse all projects \u2014 full-stack apps, creative experiments, and open-source tools.", children: [_jsx(SEO, { ...seo }), _jsx(JsonLD, { schema: breadcrumbSchema([
                    { name: "Home", url: "https://edehchinedu.dev" },
                    { name: "Projects", url: "https://edehchinedu.dev/projects" },
                ]) }), _jsx(JsonLD, { schema: collectionPageSchema({
                    name: "Projects by Edeh Chinedu Daniel",
                    description: "Full-stack applications, IoT systems, and creative coding experiments.",
                    url: "https://edehchinedu.dev/projects",
                    items: allProjects.map((p) => ({
                        name: p.name,
                        url: `https://edehchinedu.dev/projects`,
                    })),
                }) }), _jsx(Section, { id: "projects", children: _jsxs("div", { className: "space-y-12", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsx("h1", { className: "text-display-xl font-serif text-text-primary mb-4", children: "All Projects" }), _jsx("p", { className: "text-body-lg text-text-muted", children: "A collection of things I've built \u2014 from production platforms to creative experiments." })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: activeFilter === "all" ? "primary" : "ghost", size: "sm", onClick: () => setFilter("all"), children: "All" }), allTags.map((tag) => (_jsx(Button, { variant: activeFilter === tag ? "primary" : "ghost", size: "sm", onClick: () => setFilter(tag), className: "capitalize", children: tag }, tag)))] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((project, i) => (_jsx(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.05 }, children: _jsx(ProjectGridCard, { project: project }) }, project.id))) }), filtered.length === 0 && (_jsx("p", { className: "text-center text-text-muted py-12", children: "No projects match this filter." }))] }) })] }));
};
//# sourceMappingURL=Projects.js.map