import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Loader2, PenLine } from "lucide-react";
import { useGuestbookEntries } from "../features/guestbook/hooks/useGuestbook";
import { GuestbookCard } from "../features/guestbook/components/GuestbookCard";
export function GuestbookPage() {
    const navigate = useNavigate();
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGuestbookEntries();
    const sentinelRef = useRef(null);
    // Infinite scroll via IntersectionObserver
    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el)
            return;
        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: "200px",
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleObserver]);
    const allEntries = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Guestbook \u2014 Edeh Chinedu" }), _jsx("meta", { name: "description", content: "Sign the guestbook and leave a message for Edeh Chinedu." })] }), _jsxs("section", { className: "max-w-5xl mx-auto px-4 lg:px-8 py-16 sm:py-24", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center mb-12", children: [_jsxs("div", { className: "inline-flex items-center gap-2 text-accent mb-4", children: [_jsx(BookOpen, { size: 18, strokeWidth: 1.5 }), _jsx("span", { className: "text-xs font-mono uppercase tracking-widest", children: "Guestbook" })] }), _jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary", children: "Words That Echo Always" }), _jsx("p", { className: "mt-3 text-text-muted max-w-lg mx-auto text-sm sm:text-base", children: "Leave a message, share a thought, or just say hello. Every voice matters here." }), _jsxs("button", { onClick: () => navigate("/guestbook/create"), className: "mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90", children: [_jsx(PenLine, { size: 16, strokeWidth: 1.5 }), "Sign the Guestbook"] })] }), isLoading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader2, { size: 24, strokeWidth: 1.5, className: "animate-spin text-text-muted" }) })) : allEntries.length === 0 ? (_jsxs("div", { className: "text-center py-20 text-text-muted", children: [_jsx(BookOpen, { size: 32, strokeWidth: 1.5, className: "mx-auto mb-3 opacity-40" }), _jsx("p", { className: "text-sm", children: "No entries yet. Be the first to sign!" })] })) : (_jsx("div", { className: "columns-1 sm:columns-2 lg:columns-3 gap-4", children: allEntries.map((entry, i) => (_jsx(GuestbookCard, { entry: entry, index: i }, entry.id))) })), _jsx("div", { ref: sentinelRef, className: "h-px" }), isFetchingNextPage && (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { size: 20, strokeWidth: 1.5, className: "animate-spin text-text-muted" }) }))] })] }));
}
//# sourceMappingURL=Guestbook.js.map