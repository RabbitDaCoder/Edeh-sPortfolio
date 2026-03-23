import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, User } from "lucide-react";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { NotificationBell } from "../components/layout/NotificationBell";

const NAV_LABELS: { to: string; label: string }[] = [
  { to: "/", label: "Dashboard" },
  { to: "/blog", label: "Blog Posts" },
  { to: "/books", label: "Books" },
  { to: "/comments", label: "Comments" },
  { to: "/guestbook", label: "Guestbook" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/career", label: "Career" },
  { to: "/achievements", label: "Achievements" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/polaroids", label: "Polaroids" },
  { to: "/downloads", label: "Downloads" },
  { to: "/messages", label: "Messages" },
  { to: "/settings", label: "Settings" },
];

export function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const location = useLocation();
  const navigate = useNavigate();

  /* ── Drawer state management ── */

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((o) => !o), []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }, [navigate]);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("dark");
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  // Find current page label
  const currentLabel = useMemo(
    () =>
      NAV_LABELS.find((n) => {
        if (n.to === "/") return location.pathname === "/";
        return location.pathname.startsWith(n.to);
      })?.label || "Dashboard",
    [location.pathname],
  );

  return (
    <div className="flex h-screen bg-background">
      {/* ── Backdrop (mobile only) ── */}
      <div
        onClick={closeDrawer}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <AdminSidebar
        open={drawerOpen}
        onClose={closeDrawer}
        onLogout={handleLogout}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border/60 flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-sm shrink-0 z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger — visible on mobile only */}
            <button
              onClick={toggleDrawer}
              className="md:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm font-medium text-text-primary">
              {currentLabel}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <NotificationBell />

            {/* Profile pill */}
            <NavLink
              to="/settings"
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border/60 hover:border-border hover:bg-surface/60 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-text-primary hidden sm:block">
                Admin
              </span>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          ref={(el) => {
            if (el) el.scrollTop = 0;
          }}
          key={location.pathname}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
