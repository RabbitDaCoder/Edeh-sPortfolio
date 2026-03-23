import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Github, ExternalLink } from "lucide-react";
/** Convert portfolio Project to card-local ProjectData */
export function toProjectData(p) {
    return {
        index: String(p.order).padStart(2, "0"),
        name: p.name,
        description: p.description,
        tags: p.tags,
        github: p.githubUrl,
        live: p.liveUrl,
        typographicMark: p.typographicMark,
    };
}
export function ProjectCard({ project, cardRef, variant, index, }) {
    const isTop = variant === "top";
    const isPeek = variant === "peek";
    return (_jsx("div", { ref: cardRef, className: `absolute inset-y-0 ${isPeek
            ? "left-[calc(50%+0.5rem)] w-[calc(50%-0.5rem)]"
            : "left-0 w-[calc(50%-0.5rem)]"} bg-surface border border-border rounded-lg`, style: { transformOrigin: "bottom left" }, children: _jsxs("div", { className: "flex h-full", children: [_jsxs("div", { className: "w-[45%] p-6 md:p-8 flex flex-col", children: [_jsx("span", { className: "font-serif text-display-xl text-text-muted leading-none select-none", children: project.index }), _jsx("h3", { className: `font-serif text-display-lg mt-4 leading-tight ${isPeek ? "line-clamp-1" : ""}`, children: project.name }), !isPeek && (_jsx("p", { className: "text-body-md text-text-muted mt-3 leading-relaxed line-clamp-3", children: project.description })), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: (isPeek ? project.tags.slice(0, 3) : project.tags).map((tech) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tech }, tech))) })] }), _jsxs("div", { className: "relative w-[55%] flex items-center justify-center overflow-hidden h-full", children: [_jsx("span", { className: "absolute top-4 right-4 w-6 h-6 border-t border-r border-border opacity-50" }), _jsx("span", { className: "absolute bottom-4 left-4 w-6 h-6 border-b border-l border-border opacity-50" }), _jsx("span", { className: "absolute left-0 top-1/2 w-full h-px bg-border opacity-40" }), _jsx("span", { className: `font-serif text-[12rem] leading-none text-text-primary ${isPeek ? "opacity-[0.04]" : "opacity-[0.06]"} select-none pointer-events-none absolute -right-8 rotate-[-12deg]`, children: project.typographicMark }), isPeek && (_jsx("span", { className: "absolute inset-0 bg-gradient-to-r from-transparent to-surface/60 pointer-events-none" })), !isPeek && (_jsxs("div", { className: "absolute bottom-6 right-6 flex gap-3 z-10", children: [project.github && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.github, "_blank"), "aria-label": `${project.name} on GitHub`, children: _jsx(Github, { size: 16, strokeWidth: 1.5 }) })), project.live && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.live, "_blank"), "aria-label": `${project.name} live site`, children: _jsx(ExternalLink, { size: 16, strokeWidth: 1.5 }) }))] }))] })] }) }));
}
/* ── Mobile card (full-width, single column) ─────── */
export function MobileProjectCard({ project }) {
    return (_jsx("div", { className: "min-w-0 flex-[0_0_100%] px-2", children: _jsxs("div", { className: "bg-surface border border-border rounded-lg overflow-hidden", children: [_jsxs("div", { className: "relative h-40 flex items-center justify-center overflow-hidden", children: [_jsx("span", { className: "absolute top-4 right-4 w-6 h-6 border-t border-r border-border opacity-50" }), _jsx("span", { className: "absolute bottom-4 left-4 w-6 h-6 border-b border-l border-border opacity-50" }), _jsx("span", { className: "absolute left-0 top-1/2 w-full h-px bg-border opacity-40" }), _jsx("span", { className: "font-serif text-[8rem] leading-none text-text-primary opacity-[0.05] select-none pointer-events-none rotate-[-12deg]", children: project.typographicMark })] }), _jsxs("div", { className: "p-6 space-y-3", children: [_jsx("span", { className: "font-serif text-display-md text-text-muted leading-none select-none", children: project.index }), _jsx("h3", { className: "font-serif text-display-lg leading-tight", children: project.name }), _jsx("p", { className: "text-body-md text-text-muted leading-relaxed", children: project.description }), _jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: project.tags.map((tech) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tech }, tech))) }), _jsxs("div", { className: "flex gap-3 pt-3 border-t border-border", children: [project.github && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.github, "_blank"), "aria-label": `${project.name} on GitHub`, children: _jsx(Github, { size: 16, strokeWidth: 1.5 }) })), project.live && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.live, "_blank"), "aria-label": `${project.name} live site`, children: _jsx(ExternalLink, { size: 16, strokeWidth: 1.5 }) }))] })] })] }) }));
}
//# sourceMappingURL=ProjectCard.js.map