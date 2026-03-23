import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useCallback } from "react";
import { BlogCard } from "./BlogCard";
export const BlogGrid = ({ posts, hasMore, onLoadMore, isLoading, }) => {
    const sentinelRef = useRef(null);
    const handleIntersection = useCallback((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el)
            return;
        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin: "200px",
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleIntersection]);
    return (_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: posts.map((post, i) => (_jsx(BlogCard, { post: post, index: i }, post.id))) }), _jsx("div", { ref: sentinelRef, className: "h-4" }), isLoading && (_jsx("div", { className: "flex justify-center py-8", children: _jsx("div", { className: "w-6 h-6 border-2 border-border border-t-text-primary rounded-full animate-spin" }) })), !hasMore && posts.length > 0 && (_jsx("p", { className: "text-center text-sm text-text-muted py-8", children: "You've reached the end" }))] }));
};
//# sourceMappingURL=BlogGrid.js.map