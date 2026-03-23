import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ChevronLogo } from "../ui/ChevronLogo";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/portfolio";
export const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const navLinks = NAV_LINKS;
    const handleNavClick = useCallback((link) => {
        setIsMenuOpen(false);
        // Blog and Books always route to their pages
        if (link.id === "blog") {
            navigate("/blog");
            return;
        }
        if (link.id === "books") {
            navigate("/books");
            return;
        }
        if (link.id === "guestbook") {
            navigate("/guestbook");
            return;
        }
        const anchor = link.id;
        if (isHome) {
            const el = document.getElementById(anchor);
            el?.scrollIntoView({ behavior: "smooth" });
        }
        else {
            navigate("/");
            setTimeout(() => {
                const el = document.getElementById(anchor);
                el?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [isHome, navigate]);
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "h-12 bg-background/80 backdrop-blur-md border-b border-border"
                    : "h-16 bg-background/60 backdrop-blur-sm"}`, children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between", children: [_jsxs("a", { href: "/", className: "flex items-center gap-2 group", children: [_jsx(ChevronLogo, { size: 28, className: "text-primary" }), _jsxs("span", { className: "text-lg font-serif font-bold tracking-tight text-text-primary", children: ["Edeh", _jsx("span", { className: "text-text-muted", children: "." })] }), _jsx("span", { className: "sm:inline-block h-4 w-px bg-border" }), _jsx("span", { className: "sm:inline-block text-[0.65rem] font-mono uppercase tracking-[0.2em] text-text-muted group-hover:text-text-primary transition-colors", children: "RabbitDaCoder" })] }), _jsx("div", { className: "hidden md:flex items-center gap-8", children: navLinks.map((link) => (_jsxs("button", { onClick: () => handleNavClick(link), className: "text-sm text-text-muted hover:text-text-primary transition-colors relative group", children: [link.label, _jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" })] }, link.id))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => document
                                        .getElementById("cv")
                                        ?.scrollIntoView({ behavior: "smooth" }), className: "hidden sm:inline-flex", children: "Resume" }), _jsx(ThemeToggle, {}), _jsx("button", { onClick: () => setIsMenuOpen(!isMenuOpen), className: "md:hidden p-2 text-text-primary hover:bg-surface rounded-sm transition-colors", "aria-label": "Toggle menu", children: isMenuOpen ? (_jsx(X, { className: "w-5 h-5" })) : (_jsx(Menu, { className: "w-5 h-5" })) })] })] }) }), _jsx(AnimatePresence, { children: isMenuOpen && (_jsx(motion.div, { initial: { opacity: 0, x: 300 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 300 }, transition: { duration: 0.3 }, className: "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden", onClick: () => setIsMenuOpen(false), children: _jsx(motion.div, { initial: { x: 300 }, animate: { x: 0 }, exit: { x: 300 }, onClick: (e) => e.stopPropagation(), className: "absolute right-0 top-0 h-screen w-64 bg-background border-l border-border flex flex-col", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-text-primary mb-8", children: "Menu" }), _jsxs("div", { className: "flex flex-col gap-4", children: [navLinks.map((link, i) => (_jsx(motion.button, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.05 }, onClick: () => handleNavClick(link), className: "text-left text-text-muted hover:text-text-primary transition-colors py-2 border-b border-border", children: link.label }, link.id))), _jsx(Button, { variant: "primary", className: "mt-4 w-full", onClick: () => {
                                                document
                                                    .getElementById("cv")
                                                    ?.scrollIntoView({ behavior: "smooth" });
                                                setIsMenuOpen(false);
                                            }, children: "Download Resume" })] })] }) }) })) })] }));
};
//# sourceMappingURL=Navigation.js.map