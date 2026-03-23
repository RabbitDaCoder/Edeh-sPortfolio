import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { ArrowRight } from "lucide-react";
export const FeaturedPost = ({ post }) => {
    const navigate = useNavigate();
    return (_jsxs(motion.article, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, onClick: () => navigate(`/blog/${post.slug}`), className: "group cursor-pointer border border-border rounded-md overflow-hidden hover:border-text-muted/40 transition-colors", children: [_jsxs("div", { className: "w-full h-64 md:h-80 bg-surface flex items-center justify-center relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" }), _jsx("span", { className: "text-display-lg font-serif text-text-muted/20 select-none", children: "Featured" })] }), _jsxs("div", { className: "p-6 md:p-8 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "default", className: "text-xs", children: post.category }), _jsx("span", { className: "text-xs text-text-muted font-mono", children: post.readTime }), _jsx("span", { className: "text-xs text-text-muted font-mono", children: new Date(post.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }) })] }), _jsx("h2", { className: "text-display-md font-serif text-text-primary group-hover:text-accent transition-colors", children: post.title }), _jsx("p", { className: "text-body-md text-text-muted max-w-2xl", children: post.excerpt }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-text-muted group-hover:text-text-primary transition-colors pt-2", children: ["Read article", _jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })] })] })] }));
};
//# sourceMappingURL=FeaturedPost.js.map