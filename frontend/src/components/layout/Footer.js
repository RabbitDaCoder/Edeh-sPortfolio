import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { PERSONAL } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";
export const Footer = () => {
    const { data: personal = PERSONAL } = useProfile();
    const currentYear = new Date().getFullYear();
    const fullName = personal.name;
    const socialLinks = [
        {
            icon: Github,
            href: personal.github,
            label: "GitHub",
        },
        {
            icon: Linkedin,
            href: personal.linkedin,
            label: "LinkedIn",
        },
        {
            icon: Twitter,
            href: personal.twitter,
            label: "Twitter",
        },
        {
            icon: Mail,
            href: `mailto:${personal.email}`,
            label: "Email",
        },
    ];
    return (_jsx("footer", { className: "bg-background border-t border-border mt-spacing-section", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-20", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12 mb-12", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-serif font-semibold text-text-primary mb-2", children: fullName }), _jsx("p", { className: "text-sm text-text-muted leading-relaxed", children: personal.tagline })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide", children: "Navigation" }), _jsx("ul", { className: "space-y-2", children: ["About", "Work", "Blog", "Contact"].map((item) => (_jsx("li", { children: _jsx("a", { href: `#${item.toLowerCase()}`, className: "text-sm text-text-muted hover:text-text-primary transition-colors", children: item }) }, item))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide", children: "Connect" }), _jsx("div", { className: "flex gap-4", children: socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (_jsx("a", { href: social.href, target: "_blank", rel: "noopener noreferrer", "aria-label": social.label, className: "p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-sm transition-all", children: _jsx(Icon, { className: "w-4 h-4" }) }, social.label));
                                    }) })] })] }), _jsx("div", { className: "border-t border-border" }), _jsxs("div", { className: "mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("p", { className: "text-xs text-text-muted", children: ["\u00A9 ", currentYear, " ", fullName, ". All rights reserved."] }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Link, { to: "/privacy", className: "text-xs text-text-muted hover:text-text-primary transition-colors", children: "Privacy Policy" }), _jsx(Link, { to: "/terms", className: "text-xs text-text-muted hover:text-text-primary transition-colors", children: "Terms of Service" })] })] })] }) }));
};
//# sourceMappingURL=Footer.js.map