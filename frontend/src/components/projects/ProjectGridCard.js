import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Github, ExternalLink } from "lucide-react";
export const ProjectGridCard = React.memo(({ project }) => {
    const hasLinks = project.liveUrl || project.githubUrl;
    return (_jsxs(Card, { hover: "scale", className: "p-6 space-y-4 h-full flex flex-col", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("span", { className: "font-serif text-display-md text-text-muted leading-none select-none", children: String(project.order).padStart(2, "0") }), _jsx("span", { className: "font-serif text-3xl text-text-muted/10 select-none pointer-events-none", children: project.typographicMark })] }), _jsx("h3", { className: "font-serif text-display-sm text-text-primary leading-tight", children: project.name }), _jsx("p", { className: "text-sm text-text-muted leading-relaxed flex-1", children: project.description }), _jsx("div", { className: "flex flex-wrap gap-2", children: project.tags.map((tech) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tech }, tech))) }), _jsx("div", { className: "flex gap-3 pt-3 border-t border-border", children: hasLinks ? (_jsxs(_Fragment, { children: [project.githubUrl && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.githubUrl, "_blank"), "aria-label": `${project.name} on GitHub`, children: _jsx(Github, { size: 16, strokeWidth: 1.5 }) })), project.liveUrl && (_jsx(Button, { variant: "icon", size: "sm", onClick: () => window.open(project.liveUrl, "_blank"), "aria-label": `${project.name} live site`, children: _jsx(ExternalLink, { size: 16, strokeWidth: 1.5 }) }))] })) : (_jsx(Badge, { variant: "muted", className: "text-xs", children: "Coming Soon" })) })] }));
});
ProjectGridCard.displayName = "ProjectGridCard";
//# sourceMappingURL=ProjectGridCard.js.map