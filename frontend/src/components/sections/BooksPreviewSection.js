import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Section } from "../layout/Section";
import { Carousel } from "../ui/Carousel";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useBooks } from "../../features/books/hooks/useBooks";
import { useFeaturedBooks } from "../../features/books/hooks/useFeaturedBooks";
import { ArrowRight } from "lucide-react";
export const BooksPreviewSection = () => {
    const navigate = useNavigate();
    const { data: featuredData } = useFeaturedBooks(6);
    const { data: allData } = useBooks(1, 6);
    const featured = featuredData ?? [];
    const fallback = allData?.items ?? allData ?? [];
    const books = featured.length > 0 ? featured : fallback;
    if (!books.length)
        return null;
    const carouselItems = books.map((book) => (_jsx("div", { className: "px-3", children: _jsxs(Card, { hover: "tilt", className: "h-full flex flex-col space-y-4", children: [_jsx("div", { className: "w-full h-56 bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm flex items-center justify-center border border-border overflow-hidden", children: book.coverImage ? (_jsx("img", { src: book.coverImage, alt: book.title, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-xs text-text-muted", children: "Book Cover" })) }), _jsxs("div", { className: "flex-1 p-4 flex flex-col space-y-3", children: [_jsx("div", { children: _jsx("h3", { className: "text-base font-semibold text-text-primary line-clamp-2", children: book.title }) }), _jsx("p", { className: "text-sm text-text-muted line-clamp-2 flex-1", children: book.description }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: new Date(book.createdAt).getFullYear() }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/books/${book.slug}`), children: _jsx(ArrowRight, { className: "w-4 h-4" }) })] })] })] }) }, book.id)));
    return (_jsx(Section, { id: "books", children: _jsxs("div", { className: "space-y-12", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-display-lg font-serif text-text-primary", children: "My Books" }), _jsxs(Button, { variant: "ghost", onClick: () => navigate("/books"), children: ["Browse all", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 }, children: _jsx(Carousel, { showControls: true, children: carouselItems }) })] }) }));
};
//# sourceMappingURL=BooksPreviewSection.js.map