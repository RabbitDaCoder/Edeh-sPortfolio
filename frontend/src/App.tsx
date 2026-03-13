import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { GlobalCanvas } from "./components/3d/GlobalCanvas";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { SectionError } from "./components/ui/SectionError";
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
const BlogPage = React.lazy(() =>
  import("./pages/Blog").then((m) => ({ default: m.BlogPage })),
);
const BlogDetailPage = React.lazy(() =>
  import("./pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })),
);
const BooksPage = React.lazy(() =>
  import("./pages/Books").then((m) => ({ default: m.BooksPage })),
);
const BooksDetailPage = React.lazy(() =>
  import("./pages/BooksDetail").then((m) => ({ default: m.BooksDetailPage })),
);
const ContactPage = React.lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.ContactPage })),
);
const ProjectsPage = React.lazy(() =>
  import("./pages/Projects").then((m) => ({ default: m.ProjectsPage })),
);

// Suspense fallback
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-text-muted">Loading...</div>
  </div>
);

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <ScrollToTop />
          <div className="text-text-primary min-h-screen">
            {/* Global 3D Canvas — wrapped in boundary so GPU failures don't blank the page */}
            <ErrorBoundary fallback={null}>
              <GlobalCanvas />
            </ErrorBoundary>

            {/* Scroll Progress Bar */}
            <ScrollProgress />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="relative z-10 pt-16">
              <Routes>
                {/* Home - Single Page with all sections */}
                <Route
                  path="/"
                  element={
                    <div className="divide-y divide-border/10">
                      <HeroSection />
                      <AboutSection />
                      <ErrorBoundary fallback={<SectionError />}>
                        <SkillsSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <WorkSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <CareerSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <AchievementsSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <TestimonialsSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <BlogPreviewSection />
                      </ErrorBoundary>
                      <ErrorBoundary fallback={<SectionError />}>
                        <BooksPreviewSection />
                      </ErrorBoundary>
                      <BookCallSection />
                      <CvDownloadSection />
                    </div>
                  }
                />

                {/* Blog Routes */}
                <Route
                  path="/blog"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <BlogPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />
                <Route
                  path="/blog/:slug"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <BlogDetailPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />

                {/* Books Routes */}
                <Route
                  path="/books"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <BooksPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />
                <Route
                  path="/books/:slug"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <BooksDetailPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />

                {/* Contact Route */}
                <Route
                  path="/contact"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <ContactPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />

                {/* Projects Route */}
                <Route
                  path="/projects"
                  element={
                    <React.Suspense fallback={<PageFallback />}>
                      <ErrorBoundary>
                        <ProjectsPage />
                      </ErrorBoundary>
                    </React.Suspense>
                  }
                />
              </Routes>
            </main>

            {/* Footer */}
            <div className="relative z-10">
              <Footer />
            </div>
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
