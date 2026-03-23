import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Twitter, Facebook, Instagram, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildTwitterShare, buildFacebookShare, buildFacebookCaption, buildInstagramCaption, buildWhatsAppShare, } from "../../utils/share";
export default function ShareBar({ title, slug }) {
    const [copied, setCopied] = useState(null);
    const copyToClipboard = useCallback(async (text, label) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    }, []);
    const openInNewTab = useCallback((url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }, []);
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm text-text-secondary font-medium", children: "Share:" }), _jsx("button", { onClick: () => openInNewTab(buildTwitterShare(title, slug)), className: "p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors", "aria-label": "Share on Twitter", children: _jsx(Twitter, { size: 18, strokeWidth: 1.5 }) }), _jsxs("button", { onClick: async () => {
                    await copyToClipboard(buildFacebookCaption(title, slug), "facebook");
                    openInNewTab(buildFacebookShare(slug));
                }, className: "relative p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors", "aria-label": "Share on Facebook (caption copied to clipboard)", children: [_jsx(Facebook, { size: 18, strokeWidth: 1.5 }), _jsx(AnimatePresence, { children: copied === "facebook" && _jsx(CopiedBadge, {}) })] }), _jsxs("button", { onClick: () => copyToClipboard(buildInstagramCaption(title, slug), "instagram"), className: "relative p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors", "aria-label": "Copy Instagram caption", children: [_jsx(Instagram, { size: 18, strokeWidth: 1.5 }), _jsx(AnimatePresence, { children: copied === "instagram" && _jsx(CopiedBadge, {}) })] }), _jsx("button", { onClick: () => openInNewTab(buildWhatsAppShare(title, slug)), className: "p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors", "aria-label": "Share on WhatsApp", children: _jsx(Share2, { size: 18, strokeWidth: 1.5 }) })] }));
}
function CopiedBadge() {
    return (_jsx(motion.span, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, className: "absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-accent text-background px-1.5 py-0.5 rounded whitespace-nowrap", children: "Copied!" }));
}
//# sourceMappingURL=ShareBar.js.map