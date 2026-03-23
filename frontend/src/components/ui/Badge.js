import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/cn";
const variants = {
    default: "bg-accent text-background",
    muted: "bg-surface text-text-muted",
    outline: "border border-border text-text-muted bg-transparent",
    pulse: "bg-surface text-text-muted",
};
export function Badge({ variant = "default", className, children, ...props }) {
    return (_jsxs("span", { className: cn("inline-flex items-center gap-2 px-3 py-1 rounded-pill text-label uppercase tracking-widest font-body font-medium", variants[variant], className), ...props, children: [variant === "pulse" && (_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" })), children] }));
}
//# sourceMappingURL=Badge.js.map