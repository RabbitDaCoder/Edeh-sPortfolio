import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export function LegalSection({ number, heading, children }) {
    return (_jsxs(motion.section, { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.4 }, style: { marginBottom: "3rem" }, children: [_jsxs("div", { className: "flex items-baseline gap-4 mb-4", style: {
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "0.75rem",
                }, children: [_jsx("span", { className: "font-mono text-label text-muted", style: { minWidth: "2rem" }, children: number }), _jsx("h2", { className: "font-display text-display-md text-text-primary", children: heading })] }), _jsx("div", { className: "font-body text-body-md text-muted leading-relaxed", style: { paddingLeft: "3rem" }, children: children })] }));
}
/** A paragraph of legal prose */
export function LP({ children }) {
    return _jsx("p", { style: { marginBottom: "1rem", lineHeight: 1.8 }, children: children });
}
/** An unordered list */
export function LList({ items }) {
    return (_jsx("ul", { style: {
            margin: "0.5rem 0 1rem",
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
        }, children: items.map((item, i) => (_jsx("li", { style: { lineHeight: 1.7 }, children: item }, i))) }));
}
/** A highlighted callout box */
export function LCallout({ children }) {
    return (_jsx("div", { style: {
            borderLeft: "3px solid var(--color-text-primary)",
            paddingLeft: "1rem",
            margin: "1.25rem 0",
            opacity: 0.8,
        }, children: children }));
}
/** A contact email link */
export function LEmail() {
    return (_jsx("a", { href: "mailto:edehchinedu59@gmail.com", style: {
            color: "var(--color-text-primary)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
        }, children: "edehchinedu59@gmail.com" }));
}
//# sourceMappingURL=LegalSection.js.map