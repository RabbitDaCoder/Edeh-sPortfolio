import React, { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { apiClient } from "./lib/axios";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { GlobalCanvasLoader } from "./components/layout/GlobalCanvasLoader";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { SectionError } from "./components/ui/SectionError";
import { SplashScreen, BootTask } from "./components/ui/SplashScreen";
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
const GuestbookPage = React.lazy(() =>
  import("./pages/Guestbook").then((m) => ({ default: m.GuestbookPage })),
);
const GuestbookCreatePage = React.lazy(() =>
  import("./pages/GuestbookCreate").then((m) => ({
    default: m.GuestbookCreatePage,
  })),
);
const PrivacyPage = React.lazy(() => import("./pages/legal/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/legal/TermsPage"));

// Suspense fallback
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-text-muted">Loading...</div>
  </div>
);

// ─── Boot tasks — prefetch critical data into React Query cache ──────────────

const BOOT_TASKS: BootTask[] = [
  {
    label: "API health check",
    run: async () => {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
      const healthUrl = baseUrl.replace(/\/api\/v\d+$/, "/health");
      const res = await fetch(healthUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    },
  },
  {
    label: "Profile data",
    run: async () => {
      await apiClient.get("/profile");
    },
  },
  {
    label: "Skills catalogue",
    run: async () => {
      await apiClient.get("/skills");
    },
  },
  {
    label: "Projects portfolio",
    run: async () => {
      await apiClient.get("/projects?published=true");
    },
  },
  {
    label: "Career timeline",
    run: async () => {
      await apiClient.get("/career");
    },
  },
  {
    label: "Blog articles",
    run: async () => {
      await apiClient.get("/blog", { params: { page: 1, limit: 6 } });
    },
  },
];

export function App() {
  const [ready, setReady] = useState(false);
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {!ready && (
          <SplashScreen
            appName="EDEH CHINEDU"
            version="1.0.0"
            tasks={BOOT_TASKS}
            minDisplayMs={2000}
            onReady={() => setReady(true)}
          />
        )}

        <div
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: ready ? "all" : "none",
          }}
        >
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ScrollToTop />
            <div className="text-text-primary min-h-screen">
              {/* Global 3D Canvas — wrapped in boundary so GPU failures don't blank the page */}
              <ErrorBoundary fallback={null}>
                <GlobalCanvasLoader />
              </ErrorBoundary>

              {/* Scroll Progress Bar */}
              <ScrollProgress />

              {/* Navigation */}
              <Navigation />

              {/* Main Content */}
              <main className="relative z-10 pt-16 overflow-x-hidden">
                <Routes>
                  {/* Home - Single Page with all sections */}
                  <Route
                    path="/"
                    element={
                      <div className="divide-y divide-border/10">
                        <HomeSEO />
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

                  {/* Guestbook Route */}
                  <Route
                    path="/guestbook"
                    element={
                      <React.Suspense fallback={<PageFallback />}>
                        <ErrorBoundary>
                          <GuestbookPage />
                        </ErrorBoundary>
                      </React.Suspense>
                    }
                  />
                  <Route
                    path="/guestbook/create"
                    element={
                      <React.Suspense fallback={<PageFallback />}>
                        <ErrorBoundary>
                          <GuestbookCreatePage />
                        </ErrorBoundary>
                      </React.Suspense>
                    }
                  />

                  {/* Legal Routes */}
                  <Route
                    path="/privacy"
                    element={
                      <React.Suspense fallback={<PageFallback />}>
                        <PrivacyPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <React.Suspense fallback={<PageFallback />}>
                        <TermsPage />
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
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
