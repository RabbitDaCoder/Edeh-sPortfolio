import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { useSkills } from "../../features/skills/hooks/useSkills";
import { SKILL_CATEGORY_LABELS, } from "../../data/portfolio";
export const SkillsSection = () => {
    const { data: skills } = useSkills();
    const grouped = useMemo(() => {
        if (!skills?.length)
            return [];
        const map = new Map();
        for (const tech of skills) {
            const list = map.get(tech.category) ?? [];
            list.push(tech.name);
            map.set(tech.category, list);
        }
        return Array.from(map.entries()).map(([category, items]) => ({
            category,
            label: SKILL_CATEGORY_LABELS[category],
            skills: items,
        }));
    }, [skills]);
    if (!grouped.length)
        return null;
    return (_jsx(Section, { id: "skills", children: _jsxs("div", { className: "space-y-12", children: [_jsx("h2", { className: "text-display-lg font-serif text-text-primary", children: "Skills & Expertise" }), _jsx("div", { className: "space-y-8", children: grouped.map((group) => (_jsxs("div", { children: [_jsx("h3", { className: "text-body-md font-semibold text-text-primary mb-4", children: group.label }), _jsx("div", { className: "flex flex-wrap gap-3", children: group.skills.map((skill) => (_jsx(Badge, { variant: "outline", children: skill }, skill))) })] }, group.category))) })] }) }));
};
//# sourceMappingURL=SkillsSection.js.map