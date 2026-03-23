import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { GuestbookForm } from "../features/guestbook/components/GuestbookForm";
export function GuestbookCreatePage() {
    const navigate = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "Sign the Guestbook \u2014 Edeh Chinedu" }), _jsx("meta", { name: "description", content: "Leave a message in Edeh Chinedu's guestbook." })] }), _jsx("section", { className: "max-w-2xl mx-auto px-4 lg:px-8 py-16 sm:py-24", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("button", { onClick: () => navigate("/guestbook"), className: "inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8", children: [_jsx(ArrowLeft, { size: 16, strokeWidth: 1.5 }), "Back to Guestbook"] }), _jsxs("div", { className: "text-center mb-10", children: [_jsxs("div", { className: "inline-flex items-center gap-2 text-accent mb-4", children: [_jsx(BookOpen, { size: 18, strokeWidth: 1.5 }), _jsx("span", { className: "text-xs font-mono uppercase tracking-widest", children: "Sign the Guestbook" })] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-serif font-bold text-text-primary", children: "Leave Your Mark" }), _jsx("p", { className: "mt-3 text-text-muted max-w-md mx-auto text-sm", children: "Share a thought, a kind word, or just say hello." })] }), _jsx(GuestbookForm, {})] }) })] }));
}
//# sourceMappingURL=GuestbookCreate.js.map