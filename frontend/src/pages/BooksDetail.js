import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useBook } from "../features/books/hooks/useBooks";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { bookSchema, breadcrumbSchema } from "../lib/schemas";
export const BooksDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: book, isLoading, isError } = useBook(slug || "");
    // Redirect on 404
    useEffect(() => {
        if (isError)
            navigate("/books", { replace: true });
    }, [isError, navigate]);
    const title = book?.title ?? "";
    const description = book?.description ?? "";
    const price = book?.price ?? "";
    const coverImage = book?.coverImage;
    const fileUrl = book?.fileUrl;
    const createdAt = book?.createdAt ?? "";
    const seo = useSEO({
        title: title || "Book",
        description,
        canonical: `https://edehchinedu.dev/books/${slug}`,
        ogType: "book",
        ogTitle: title,
        ogDescription: description,
        twitterTitle: title,
        twitterDesc: description,
        keywords: [
            title,
            "Edeh Chinedu Daniel",
            "RabbitDaCoder Book",
            "Engineering Book",
        ],
    });
    // Loading state
    if (isLoading) {
        return (_jsx(PageWrapper, { title: "Loading...", description: "", children: _jsx(Section, { id: "book-detail", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12 py-16", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "w-full aspect-[3/4] bg-surface animate-pulse rounded-sm" }), _jsx("div", { className: "h-32 bg-surface animate-pulse rounded-sm" })] }), _jsxs("div", { className: "md:col-span-2 space-y-4", children: [_jsx("div", { className: "h-10 w-3/4 bg-surface animate-pulse rounded" }), _jsx("div", { className: "h-4 w-1/3 bg-surface animate-pulse rounded" }), _jsx("div", { className: "space-y-3 mt-8", children: Array.from({ length: 6 }).map((_, i) => (_jsx("div", { className: "h-4 bg-surface animate-pulse rounded", style: { width: `${60 + Math.random() * 40}%` } }, i))) })] })] }) }) }));
    }
    if (!book)
        return null;
    return (_jsxs(PageWrapper, { title: `${title} | Books`, description: description, children: [_jsx(SEO, { ...seo }), _jsx(JsonLD, { schema: bookSchema({
                    title,
                    slug: slug || "",
                    description,
                    price: parseFloat(String(price)) || 0,
                }) }), _jsx(JsonLD, { schema: breadcrumbSchema([
                    { name: "Home", url: "https://edehchinedu.dev" },
                    { name: "Books", url: "https://edehchinedu.dev/books" },
                    { name: title, url: `https://edehchinedu.dev/books/${slug}` },
                ]) }), _jsx(Section, { id: "book-detail", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("button", { onClick: () => navigate("/books"), className: "flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Books"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12", children: [_jsxs("div", { className: "space-y-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full aspect-[3/4] bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm border border-border flex items-center justify-center sticky top-24 overflow-hidden", children: coverImage ? (_jsx("img", { src: coverImage, alt: title, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-text-muted font-serif text-lg px-4 text-center", children: title })) }), _jsxs(Card, { className: "p-6 space-y-4", children: [price && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-muted uppercase tracking-wide", children: "Price" }), _jsx("p", { className: "text-3xl font-serif font-semibold text-text-primary", children: price })] })), fileUrl && (_jsx(Button, { variant: "primary", size: "lg", className: "w-full", onClick: () => window.open(fileUrl, "_blank", "noopener"), children: "Get Book" }))] })] }), _jsxs("div", { className: "md:col-span-2 space-y-8", children: [_jsxs("header", { className: "space-y-4", children: [_jsx("h1", { className: "text-display-lg font-serif text-text-primary", children: title }), _jsx("p", { className: "text-lg text-text-muted", children: "Edeh Chinedu Daniel" }), _jsx("div", { className: "flex items-center gap-3", children: createdAt && (_jsx(Badge, { variant: "muted", children: new Date(createdAt).getFullYear() })) })] }), _jsx("div", { className: "space-y-6 text-text-muted leading-relaxed prose prose-invert max-w-none", children: _jsx("p", { children: description }) })] })] })] }) })] }));
};
//# sourceMappingURL=BooksDetail.js.map