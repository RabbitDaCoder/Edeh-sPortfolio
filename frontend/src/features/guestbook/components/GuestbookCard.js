import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { motion } from "framer-motion";
import { Pin, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
// 5 visual style variants that cycle through entries
const CARD_STYLES = [
    "border-accent/30 bg-accent/5",
    "border-primary/30 bg-primary/5",
    "border-emerald-500/30 bg-emerald-500/5",
    "border-amber-500/30 bg-amber-500/5",
    "border-rose-500/30 bg-rose-500/5",
];
export const GuestbookCard = React.memo(({ entry, index }) => {
    const style = CARD_STYLES[index % CARD_STYLES.length];
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: (index % 10) * 0.04 }, className: `group relative break-inside-avoid mb-4 rounded-lg border p-4 transition-shadow hover:shadow-md ${style}`, children: [entry.isFirstPost && (_jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [_jsx(Star, { size: 14, strokeWidth: 1.5, className: "text-amber-500 fill-amber-500" }), _jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-amber-500", children: "First Post" })] })), entry.pinned && !entry.isFirstPost && (_jsx(Pin, { size: 14, strokeWidth: 1.5, className: "absolute top-3 right-3 text-accent rotate-45" })), _jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap leading-relaxed", children: entry.message }), _jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-xs font-medium text-text-primary truncate", children: entry.name }), entry.handle && (_jsxs("p", { className: "text-[11px] text-text-muted truncate", children: ["@", entry.handle] }))] }), _jsxs("div", { className: "shrink-0 flex items-center gap-1.5 text-[11px] text-text-muted", children: [entry.country && _jsx("span", { children: entry.country }), _jsx("span", { children: formatDistanceToNow(new Date(entry.createdAt), {
                                    addSuffix: true,
                                }) })] })] })] }));
});
GuestbookCard.displayName = "GuestbookCard";
//# sourceMappingURL=GuestbookCard.js.map