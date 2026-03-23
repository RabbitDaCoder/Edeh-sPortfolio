import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Section } from "../layout/Section";
import { Carousel } from "../ui/Carousel";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useBlogs } from "../../features/blog/hooks/useBlog";
import { useFeaturedBlogs } from "../../features/blog/hooks/useFeaturedBlogs";
import { ArrowRight } from "lucide-react";
export const BlogPreviewSection = () => {
    const navigate = useNavigate();
    const { data: featuredData } = useFeaturedBlogs(6);
    const { data: allData } = useBlogs(1, 6);
    const featured = featuredData ?? [];
    const fallback = allData?.items ?? allData ?? [];
    const posts = featured.length > 0 ? featured : fallback;
    if (!posts.length)
        return null;
    const carouselItems = posts.map((post) => (_jsx("div", { className: "px-3", children: _jsxs(Card, { hover: "lift", className: "h-full flex flex-col p-6 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsx(Badge, { variant: "muted", className: "text-xs", children: post.category ?? post.tags?.[0] ?? "Blog" }), post.readTime && (_jsxs("span", { className: "text-xs text-text-muted font-mono whitespace-nowrap", children: [post.readTime, " min read"] }))] }), _jsx("h3", { className: "text-base font-semibold text-text-primary line-clamp-2", children: post.title }), _jsx("p", { className: "text-sm text-text-muted line-clamp-2 flex-1", children: post.excerpt }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border", children: [_jsx("span", { className: "text-xs text-text-muted font-mono", children: new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }) }), _jsx(ArrowRight, { className: "w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" })] })] }) }, post.id)));
    return (_jsx(Section, { id: "blog", className: "bg-surface/30", children: _jsxs("div", { className: "space-y-12", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-display-lg font-serif text-text-primary", children: "Latest Articles" }), _jsxs(Button, { variant: "ghost", onClick: () => navigate("/blog"), children: ["View all", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 }, children: _jsx(Carousel, { showControls: true, autoplay: true, autoplayInterval: 6000, children: carouselItems }) })] }) }));
};
//# sourceMappingURL=BlogPreviewSection.js.map