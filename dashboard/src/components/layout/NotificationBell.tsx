import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, MessageSquare, BookOpen, X } from "lucide-react";
import {
  useUnreadCount,
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  Notification,
} from "../../hooks/useNotifications";

// Simple relative time — no date-fns dependency needed
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function NotifIcon({ type }: { type: string }) {
  const cls = "w-3.5 h-3.5 flex-shrink-0";
  if (type === "guestbook_entry") return <BookOpen className={cls} />;
  if (type === "blog_comment" || type === "blog_reply")
    return <MessageSquare className={cls} />;
  return <Bell className={cls} />;
}

export const NotificationBell = memo(function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;

  const { data, isLoading } = useNotifications(open);

  const markReadMut = useMarkRead();
  const markAllReadMut = useMarkAllRead();

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleNotifClick = useCallback(
    (notif: Notification) => {
      if (!notif.read) markReadMut.mutate(notif.id);
      if (notif.link) {
        navigate(notif.link);
        setOpen(false);
      }
    },
    [markReadMut, navigate],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllReadMut.mutate();
  }, [markAllReadMut]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+8px)] right-0 w-[360px] max-w-[calc(100vw-2rem)] bg-surface border border-border/60 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-150 origin-top-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="bg-text-primary text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-border/40 transition-colors"
              >
                <Check className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-border/40 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="py-8 text-center text-xs text-text-muted font-mono">
              Loading...
            </div>
          )}

          {/* Empty */}
          {!isLoading && !data?.notifications?.length && (
            <div className="py-10 text-center">
              <Bell
                className="w-7 h-7 mx-auto mb-2 text-text-primary opacity-20"
                strokeWidth={1}
              />
              <p className="text-xs text-text-muted font-mono">
                No notifications yet
              </p>
            </div>
          )}

          {/* Items */}
          {data?.notifications?.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`flex gap-3 px-4 py-3 border-b border-border/40 transition-colors ${
                notif.link ? "cursor-pointer" : "cursor-default"
              } ${notif.read ? "bg-transparent" : "bg-accent/5"} hover:bg-border/30`}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                  notif.read
                    ? "bg-surface border-border/60 text-text-muted"
                    : "bg-surface border-border text-text-primary"
                }`}
              >
                <NotifIcon type={notif.type} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] leading-snug mb-0.5 ${
                    notif.read
                      ? "text-text-primary font-normal"
                      : "text-text-primary font-semibold"
                  }`}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-text-muted/60 font-mono mt-1 block">
                  {timeAgo(notif.createdAt)}
                </span>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {(data?.total ?? 0) > 15 && (
          <div className="px-4 py-3 border-t border-border/60 text-center">
            <button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-[11px] text-text-muted font-mono tracking-wider hover:text-text-primary transition-colors"
            >
              View all notifications &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
