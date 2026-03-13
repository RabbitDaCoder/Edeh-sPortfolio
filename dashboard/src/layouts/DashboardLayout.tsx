import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Briefcase,
  Trophy,
  Download,
  Mail,
  FolderKanban,
  Cpu,
  MessageSquare,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";

interface NavGroup {
  label: string;
  items: {
    to: string;
    icon: React.FC<{ className?: string }>;
    label: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Content",
    items: [
      { to: "/blog", icon: FileText, label: "Blog Posts" },
      { to: "/books", icon: BookOpen, label: "Books" },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { to: "/projects", icon: FolderKanban, label: "Projects" },
      { to: "/skills", icon: Cpu, label: "Skills" },
      { to: "/career", icon: Briefcase, label: "Career" },
      { to: "/achievements", icon: Trophy, label: "Achievements" },
      { to: "/testimonials", icon: MessageSquare, label: "Testimonials" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/downloads", icon: Download, label: "Downloads" },
      { to: "/messages", icon: Mail, label: "Messages" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Find current page label
  const currentLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((n) => {
        if (n.to === "/") return location.pathname === "/";
        return location.pathname.startsWith(n.to);
      })?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface/80 backdrop-blur-xl border-r border-border/60 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border/60">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-background text-sm font-bold font-mono">
                E
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold text-text-primary tracking-tight">
                Edeh<span className="text-text-muted">.</span>
              </span>
              <span className="text-[10px] text-text-muted font-mono tracking-wider uppercase">
                Dashboard
              </span>
            </div>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {group.label !== "Overview" && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                          isActive
                            ? "bg-accent text-background font-medium shadow-sm"
                            : "text-text-muted hover:text-text-primary hover:bg-border/40"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/60 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <h1 className="text-sm font-medium text-text-primary">
                {currentLabel}
              </h1>
            </div>
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
          className="flex-1 overflow-y-auto p-6"
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
