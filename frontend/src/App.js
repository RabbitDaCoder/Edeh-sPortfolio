import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { GlobalCanvasLoader } from "./components/layout/GlobalCanvasLoader";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { SectionError } from "./components/ui/SectionError";
import { HomeSEO } from "./pages/HomeSEO";
import "./index.css";
function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}
// Sections
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { WorkSection } from "./components/sections/WorkSection";
import { CareerSection } from "./components/sections/CareerSection";
import { AchievementsSection } from "./components/sections/AchievementsSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { BlogPreviewSection } from "./components/sections/BlogPreviewSection";
import { BooksPreviewSection } from "./components/sections/BooksPreviewSection";
import { BookCallSection } from "./components/sections/BookCallSection";
import { CvDownloadSection } from "./components/sections/CvDownloadSection";
// Route pages (lazy loaded)
const BlogPage = React.lazy(() => import("./pages/Blog").then((m) => ({ default: m.BlogPage })));
const BlogDetailPage = React.lazy(() => import("./pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })));
const BooksPage = React.lazy(() => import("./pages/Books").then((m) => ({ default: m.BooksPage })));
const BooksDetailPage = React.lazy(() => import("./pages/BooksDetail").then((m) => ({ default: m.BooksDetailPage })));
const ContactPage = React.lazy(() => import("./pages/Contact").then((m) => ({ default: m.ContactPage })));
const ProjectsPage = React.lazy(() => import("./pages/Projects").then((m) => ({ default: m.ProjectsPage })));
const GuestbookPage = React.lazy(() => import("./pages/Guestbook").then((m) => ({ default: m.GuestbookPage })));
const GuestbookCreatePage = React.lazy(() => import("./pages/GuestbookCreate").then((m) => ({
    default: m.GuestbookCreatePage,
})));
const PrivacyPage = React.lazy(() => import("./pages/legal/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/legal/TermsPage"));
// Suspense fallback
const PageFallback = () => (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-text-muted", children: "Loading..." }) }));
export function App() {
    return (_jsx(HelmetProvider, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsxs(Router, { future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: [_jsx(ScrollToTop, {}), _jsxs("div", { className: "text-text-primary min-h-screen", children: [_jsx(ErrorBoundary, { fallback: null, children: _jsx(GlobalCanvasLoader, {}) }), _jsx(ScrollProgress, {}), _jsx(Navigation, {}), _jsx("main", { className: "relative z-10 pt-16 overflow-x-hidden", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs("div", { className: "divide-y divide-border/10", children: [_jsx(HomeSEO, {}), _jsx(HeroSection, {}), _jsx(AboutSection, {}), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(SkillsSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(WorkSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(CareerSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(AchievementsSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(TestimonialsSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(BlogPreviewSection, {}) }), _jsx(ErrorBoundary, { fallback: _jsx(SectionError, {}), children: _jsx(BooksPreviewSection, {}) }), _jsx(BookCallSection, {}), _jsx(CvDownloadSection, {})] }) }), _jsx(Route, { path: "/blog", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(BlogPage, {}) }) }) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(BlogDetailPage, {}) }) }) }), _jsx(Route, { path: "/books", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(BooksPage, {}) }) }) }), _jsx(Route, { path: "/books/:slug", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(BooksDetailPage, {}) }) }) }), _jsx(Route, { path: "/contact", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(ContactPage, {}) }) }) }), _jsx(Route, { path: "/projects", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(ProjectsPage, {}) }) }) }), _jsx(Route, { path: "/guestbook", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(GuestbookPage, {}) }) }) }), _jsx(Route, { path: "/guestbook/create", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(ErrorBoundary, { children: _jsx(GuestbookCreatePage, {}) }) }) }), _jsx(Route, { path: "/privacy", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(PrivacyPage, {}) }) }), _jsx(Route, { path: "/terms", element: _jsx(React.Suspense, { fallback: _jsx(PageFallback, {}), children: _jsx(TermsPage, {}) }) })] }) }), _jsx("div", { className: "relative z-10", children: _jsx(Footer, {}) })] })] }) }) }));
}
//# sourceMappingURL=App.js.map