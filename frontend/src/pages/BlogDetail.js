import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBlog, useBlogs } from "../features/blog/hooks/useBlog";
import { useNextPost } from "../features/blog/hooks/useNextPost";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { buildArticleSchema, breadcrumbSchema } from "../lib/schemas";
import { ReadingProgress } from "../components/blog/ReadingProgress";
import { NextPostCard } from "../components/blog/NextPostCard";
import ShareBar from "../components/blog/ShareBar";
import CommentsSection from "../features/blog/components/CommentsSection";
export const BlogDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const [activeId, setActiveId] = useState("");
    const { data: post, isLoading, isError } = useBlog(slug || "");
    const { data: nextPost } = useNextPost(slug ?? "");
    // Fetch a few recent posts for "related" sidebar
    const { data: recentData } = useBlogs(1, 5);
    const relatedPosts = useMemo(() => {
        const raw = Array.isArray(recentData)
            ? recentData
            : (recentData?.data ?? []);
        return raw
            .filter((p) => p.slug !== slug)
            .slice(0, 3);
    }, [recentData, slug]);
    // Redirect to /blog on 404
    useEffect(() => {
        if (isError)
            navigate("/blog", { replace: true });
    }, [isError, navigate]);
    // Derived fields
    const title = post?.title ?? "";
    const excerpt = post?.excerpt ?? "";
    const content = post?.content ?? "";
    const category = Array.isArray(post?.tags) && post.tags.length > 0 ? post.tags[0] : "Blog";
    const readTimeStr = post?.readTime
        ? `${post.readTime} min read`
        : "5 min read";
    const dateStr = post?.createdAt ?? post?.date ?? "";
    const author = "Edeh Chinedu Daniel";
    // Parse ToC from markdown-style headings
    const tocEntries = useMemo(() => {
        const lines = content.split("\n");
        const entries = [];
        lines.forEach((line) => {
            const match = line.match(/^(#{2,3})\s+(.+)/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                entries.push({ id, text, level });
            }
        });
        return entries;
    }, [content]);
    // Render content as basic HTML
    const processedHtml = useMemo(() => {
        let idIndex = 0;
        const html = content
            .replace(/^### (.+)$/gm, '<h3 id="PLACEHOLDER_ID" class="text-xl font-semibold text-text-primary mt-10 mb-4">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 id="PLACEHOLDER_ID" class="text-display-md font-serif text-text-primary mt-12 mb-6">$1</h2>')
            .replace(/^(?!<h[23])((?!\s*$).+)$/gm, '<p class="text-body-md text-text-muted mb-4 leading-relaxed">$1</p>');
        return html.replace(/id="PLACEHOLDER_ID"/g, () => {
            const entry = tocEntries[idIndex];
            idIndex++;
            return entry ? `id="${entry.id}"` : 'id=""';
        });
    }, [content, tocEntries]);
    // Intersection observer for active ToC highlight
    useEffect(() => {
        const el = contentRef.current;
        if (!el)
            return;
        const headings = el.querySelectorAll("h2, h3");
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            }
        }, { rootMargin: "-80px 0px -60% 0px" });
        headings.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, [processedHtml]);
    const seo = useSEO({
        title: title || "Blog Post",
        description: excerpt,
        canonical: `https://edehchinedu.dev/blog/${slug}`,
        ogType: "article",
        ogTitle: title,
        ogDescription: excerpt,
        publishedTime: dateStr,
        author,
        section: category,
        tags: Array.isArray(post?.tags) ? post.tags : [category],
        keywords: [category, "Edeh Chinedu Daniel", "RabbitDaCoder"],
    });
    // Loading state
    if (isLoading) {
        return (_jsx(PageWrapper, { title: "Loading...", description: "", children: _jsx(Section, { id: "blog-detail", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6 py-16", children: [_jsx("div", { className: "h-8 w-48 bg-surface animate-pulse rounded" }), _jsx("div", { className: "h-64 bg-surface animate-pulse rounded" }), _jsx("div", { className: "space-y-3", children: Array.from({ length: 8 }).map((_, i) => (_jsx("div", { className: "h-4 bg-surface animate-pulse rounded", style: { width: `${70 + Math.random() * 30}%` } }, i))) })] }) }) }));
    }
    if (!post)
        return null;
    return (_jsxs(PageWrapper, { title: `${title} | Blog`, description: excerpt, children: [_jsx(SEO, { ...seo }), _jsx(ReadingProgress, {}), _jsx(JsonLD, { schema: buildArticleSchema({
                    title,
                    slug: slug || "",
                    excerpt,
                    content,
                    category,
                    tags: Array.isArray(post.tags) ? post.tags : [category],
                    createdAt: dateStr,
                    readTime: post.readTime ?? 5,
                }) }), _jsx(JsonLD, { schema: breadcrumbSchema([
                    { name: "Home", url: "https://edehchinedu.dev" },
                    { name: "Blog", url: "https://edehchinedu.dev/blog" },
                    { name: title, url: `https://edehchinedu.dev/blog/${slug}` },
                ]) }), _jsx(Section, { id: "blog-detail", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("button", { onClick: () => navigate("/blog"), className: "flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Blog"] }), _jsx(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, className: "w-full h-64 md:h-80 bg-surface rounded-md border border-border flex items-center justify-center mb-12 overflow-hidden relative", children: post.coverImage ? (_jsx("img", { src: post.coverImage, alt: title, className: "w-full h-full object-cover" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" }), _jsx("span", { className: "text-display-lg font-serif text-text-muted/20 select-none", children: category })] })) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12", children: [_jsxs("article", { className: "min-w-0", children: [_jsxs("header", { className: "space-y-4 mb-12", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "muted", children: category }), _jsx("span", { className: "text-xs text-text-muted font-mono", children: readTimeStr })] }), _jsx("h1", { className: "text-display-lg font-serif text-text-primary", children: title }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-text-primary", children: author }), dateStr && (_jsx("p", { className: "text-xs text-text-muted", children: new Date(dateStr).toLocaleDateString("en-US", {
                                                                        month: "long",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    }) }))] }), _jsx(ShareBar, { title: title, slug: slug || "" })] })] }), _jsx("div", { id: "article-body", ref: contentRef, className: "prose-custom", dangerouslySetInnerHTML: { __html: processedHtml } }), relatedPosts.length > 0 && (_jsxs("div", { className: "mt-16 pt-8 border-t border-border space-y-6", children: [_jsx("h3", { className: "text-lg font-semibold text-text-primary", children: "Related Articles" }), _jsx("div", { className: "space-y-3", children: relatedPosts.map((rp) => (_jsxs("button", { onClick: () => navigate(`/blog/${rp.slug}`), className: "flex items-center justify-between w-full p-4 border border-border rounded-md hover:border-text-muted/40 transition-colors text-left group", children: [_jsx("span", { className: "text-sm text-text-muted group-hover:text-text-primary transition-colors", children: rp.title }), _jsx(ArrowRight, { className: "w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" })] }, rp.slug))) })] })), nextPost && _jsx(NextPostCard, { post: nextPost }), _jsx(CommentsSection, { slug: slug || "" })] }), tocEntries.length > 0 && (_jsx("aside", { className: "hidden lg:block", children: _jsxs("nav", { className: "sticky top-24 space-y-1", children: [_jsx("p", { className: "text-xs text-text-muted uppercase tracking-wider mb-3 font-mono", children: "On this page" }), tocEntries.map((entry) => (_jsx("a", { href: `#${entry.id}`, onClick: (e) => {
                                                    e.preventDefault();
                                                    document
                                                        .getElementById(entry.id)
                                                        ?.scrollIntoView({ behavior: "smooth" });
                                                }, className: `block text-sm transition-colors ${entry.level === 3 ? "pl-4" : ""} ${activeId === entry.id
                                                    ? "text-text-primary font-medium"
                                                    : "text-text-muted hover:text-text-primary"}`, children: entry.text }, entry.id)))] }) }))] })] }) })] }));
};
//# sourceMappingURL=BlogDetail.js.map