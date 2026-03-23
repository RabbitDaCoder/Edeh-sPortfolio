import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
function getInitialTheme() {
    if (typeof window === "undefined")
        return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light")
        return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}
export function ThemeToggle() {
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (_jsx("button", { onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "p-2 rounded-md text-text-primary hover:bg-surface transition-colors duration-200", "aria-label": "Toggle theme", children: _jsx(AnimatePresence, { mode: "wait", initial: false, children: _jsx(motion.span, { initial: { rotate: -180, scale: 0.8, opacity: 0 }, animate: { rotate: 0, scale: 1, opacity: 1 }, exit: { rotate: 180, scale: 0.8, opacity: 0 }, transition: { duration: 0.25 }, className: "block", children: theme === "dark" ? (_jsx(Moon, { size: 18, strokeWidth: 1.5 })) : (_jsx(Sun, { size: 18, strokeWidth: 1.5 })) }, theme) }) }));
}
//# sourceMappingURL=ThemeToggle.js.map