import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export const NextPostCard = React.memo(function NextPostCard({ post, }) {
    const navigate = useNavigate();
    const category = post.tags?.[0];
    return (_jsx(motion.div, { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.5, ease: "easeOut" }, onClick: () => {
            navigate(`/blog/${post.slug}`);
            window.scrollTo({ top: 0, behavior: "instant" });
        }, style: { cursor: "pointer" }, children: _jsxs("div", { className: "mt-20 border-t border-border bg-surface rounded-lg overflow-hidden hover:bg-surface/80 transition-colors duration-300", children: [post.coverImage && (_jsxs("div", { style: {
                        width: "100%",
                        height: "240px",
                        overflow: "hidden",
                        position: "relative",
                    }, children: [_jsx("img", { src: post.coverImage, alt: post.title, loading: "lazy", className: "w-full h-full object-cover brightness-[0.7] transition-transform duration-500 hover:scale-[1.03]" }), _jsx("div", { style: {
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 60%)",
                            } })] })), _jsxs("div", { className: "p-8 md:p-10", children: [_jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-text-muted mb-4", children: "Up next" }), category && (_jsx("span", { className: "font-mono text-xs uppercase tracking-wider text-text-muted border border-border px-3 py-1 rounded-full inline-block mb-4", children: category })), _jsx("h3", { className: "font-serif text-display-lg leading-tight text-text-primary mt-2", children: post.title }), post.excerpt && (_jsx("p", { className: "font-sans text-body-md text-text-muted mt-4 max-w-2xl line-clamp-2", children: post.excerpt })), _jsxs("div", { className: "flex items-center justify-between mt-8 flex-wrap gap-4", children: [_jsx("span", { className: "font-mono text-xs text-text-muted", children: post.readTime ? `${post.readTime} min read` : null }), _jsxs("div", { className: "flex items-center gap-2 font-sans text-sm text-text-primary group", children: [_jsx("span", { children: "Read post" }), _jsx(ArrowRight, { size: 16, strokeWidth: 1.5, className: "transition-transform duration-200 group-hover:translate-x-1" })] })] })] })] }) }));
});
//# sourceMappingURL=NextPostCard.js.map