import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { Monitor, Globe, Server, Sparkles, Cpu, Users } from "lucide-react";
import { PERSONAL, SERVICES } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";
const ICON_MAP = {
    Monitor,
    Globe,
    Server,
    Sparkles,
    Cpu,
    Users,
};
export const AboutSection = () => {
    const { data: personal = PERSONAL } = useProfile();
    return (_jsxs(Section, { id: "about", className: "bg-surface/30", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-start", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-display-lg font-serif text-text-primary leading-[1.1]", children: ["Engineer.", _jsx("br", {}), "Creator.", _jsx("br", {}), _jsx("span", { className: "text-text-muted", children: "Builder." })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.15 }, className: "space-y-4 text-text-muted leading-relaxed", children: [_jsx("p", { children: personal.bio[0] }), _jsx("p", { children: personal.bio[1] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.3 }, children: _jsx(Card, { className: "border-l-4 border-l-accent pl-6 py-4", children: _jsxs("blockquote", { className: "italic text-text-primary", children: ["\u201C", personal.pullQuote, "\u201D"] }) }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, className: "grid grid-cols-2 gap-4", children: [
                            { value: "4+", label: "Years of experience" },
                            { value: "20+", label: "Projects delivered" },
                            { value: "5+", label: "Technologies mastered" },
                            { value: "100%", label: "Passion for craft" },
                        ].map((stat) => (_jsxs(Card, { className: "p-6 text-center space-y-2", children: [_jsx("span", { className: "text-display-md font-serif text-text-primary", children: stat.value }), _jsx("p", { className: "text-xs text-text-muted", children: stat.label })] }, stat.label))) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.3 }, className: "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16", children: SERVICES.map((service) => {
                    const Icon = ICON_MAP[service.icon];
                    return (_jsxs(Card, { hover: "scale", className: "p-6 space-y-3", children: [Icon && _jsx(Icon, { className: "w-5 h-5 text-text-muted" }), _jsx("h3", { className: "text-base font-semibold text-text-primary", children: service.title }), _jsx("p", { className: "text-sm text-text-muted leading-relaxed", children: service.description })] }, service.title));
                }) })] }));
};
//# sourceMappingURL=AboutSection.js.map