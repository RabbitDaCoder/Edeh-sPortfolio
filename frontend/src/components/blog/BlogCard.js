import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { ArrowRight } from "lucide-react";
export const BlogCard = React.memo(({ post, index }) => {
    const navigate = useNavigate();
    return (_jsx(motion.article, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.05 }, onClick: () => navigate(`/blog/${post.slug}`), className: "group cursor-pointer border border-border rounded-md p-6 hover:border-text-muted/40 transition-colors", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "muted", className: "text-xs", children: post.category }), _jsx("span", { className: "text-xs text-text-muted font-mono", children: post.readTime })] }), _jsx("h3", { className: "text-lg font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2", children: post.title }), _jsx("p", { className: "text-sm text-text-muted line-clamp-2", children: post.excerpt }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [_jsx("span", { className: "text-xs text-text-muted font-mono", children: new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }) }), _jsx(ArrowRight, { className: "w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" })] })] }) }));
});
BlogCard.displayName = "BlogCard";
//# sourceMappingURL=BlogCard.js.map