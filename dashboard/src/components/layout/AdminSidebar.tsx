import React, { useRef, useCallback, memo } from "react";
import { NavLink } from "react-router-dom";
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
  MessageCircle,
  BookMarked,
  Image,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

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
      { to: "/comments", icon: MessageCircle, label: "Comments" },
      { to: "/guestbook", icon: BookMarked, label: "Guestbook" },
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
      { to: "/polaroids", icon: Image, label: "Polaroids" },
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

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar = memo(function AdminSidebar({
  open,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const touchStartX = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const swipeDistance = touchStartX.current - e.changedTouches[0].clientX;
      if (swipeDistance > 60) onClose();
    },
    [onClose],
  );

  /* ── Shared sidebar content (desktop + mobile) ── */
  const SidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border/60 shrink-0">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-background text-sm font-bold font-mono">
              E
            </span>
          </div>
          {/* Labels hidden on tablet rail, visible on desktop + mobile drawer */}
          <div className="flex-col leading-none hidden lg:flex group-[.drawer]:flex">
            <span className="text-[13px] font-semibold text-text-primary tracking-tight">
              Edeh<span className="text-text-muted">.</span>
            </span>
            <span className="text-[10px] text-text-muted font-mono tracking-wider uppercase">
              Dashboard
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-6" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            {group.label !== "Overview" && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60 hidden lg:block group-[.drawer]:block">
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
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group/link flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                        isActive
                          ? "bg-accent text-background font-medium shadow-sm"
                          : "text-text-muted hover:text-text-primary hover:bg-border/40"
                      }`
                    }
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {/* Label: hidden on tablet rail */}
                    <span className="flex-1 hidden lg:inline group-[.drawer]:inline">
                      {item.label}
                    </span>
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-40 group-hover/link:translate-x-0 transition-all duration-200 hidden lg:block group-[.drawer]:block" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/60 shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 w-full"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline group-[.drawer]:inline">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (>= 1024px) — always visible ── */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-surface/80 backdrop-blur-xl border-r border-border/60 w-16 lg:w-64 transition-[width] duration-200">
        {SidebarContent}
      </aside>

      {/* ── Mobile drawer (< 768px) — slide-in with CSS transition ── */}
      <aside
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`group drawer md:hidden fixed inset-y-0 left-0 z-50 flex flex-col bg-surface/95 backdrop-blur-xl border-r border-border/60 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "min(280px, 85vw)",
          boxShadow: open ? "4px 0 24px rgba(0,0,0,0.5)" : "none",
        }}
        role="dialog"
        aria-modal={open}
        aria-label="Navigation menu"
        aria-hidden={!open}
      >
        {SidebarContent}
      </aside>
    </>
  );
});
