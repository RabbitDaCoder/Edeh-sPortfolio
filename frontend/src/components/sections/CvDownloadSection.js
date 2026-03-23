import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";
import { CV } from "../../data/portfolio";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
export const CvDownloadSection = () => {
    return (_jsx(Section, { id: "cv", className: "min-h-64 flex items-center justify-center", children: _jsxs(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 }, className: "text-center space-y-6 max-w-md", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-display-lg font-serif text-text-primary mb-2", children: "My Resume" }), _jsx("p", { className: "text-text-muted", children: "Download my full CV to see the complete picture of my experience, skills, and achievements." })] }), _jsx("a", { href: "/Resume.pdf", download: CV.filename, rel: "noopener noreferrer", children: _jsxs(Button, { variant: "primary", size: "lg", magnetic: true, className: "inline-flex", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Download ", CV.label] }) })] }) }));
};
//# sourceMappingURL=CvDownloadSection.js.map