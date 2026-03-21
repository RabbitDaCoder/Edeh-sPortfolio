import React from "react";
import { motion } from "framer-motion";
import { Pin, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { GuestbookEntry } from "../hooks/useGuestbook";

// 5 visual style variants that cycle through entries
const CARD_STYLES = [
  "border-accent/30 bg-accent/5",
  "border-primary/30 bg-primary/5",
  "border-emerald-500/30 bg-emerald-500/5",
  "border-amber-500/30 bg-amber-500/5",
  "border-rose-500/30 bg-rose-500/5",
] as const;

interface GuestbookCardProps {
  entry: GuestbookEntry;
  index: number;
}

export const GuestbookCard: React.FC<GuestbookCardProps> = React.memo(
  ({ entry, index }) => {
    const style = CARD_STYLES[index % CARD_STYLES.length];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: (index % 10) * 0.04 }}
        className={`group relative break-inside-avoid mb-4 rounded-lg border p-4 transition-shadow hover:shadow-md ${style}`}
      >
        {entry.isFirstPost && (
          <div className="flex items-center gap-1.5 mb-2">
            <Star
              size={14}
              strokeWidth={1.5}
              className="text-amber-500 fill-amber-500"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
              First Post
            </span>
          </div>
        )}

        {entry.pinned && !entry.isFirstPost && (
          <Pin
            size={14}
            strokeWidth={1.5}
            className="absolute top-3 right-3 text-accent rotate-45"
          />
        )}

        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
          {entry.message}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">
              {entry.name}
            </p>
            {entry.handle && (
              <p className="text-[11px] text-text-muted truncate">
                @{entry.handle}
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-text-muted">
            {entry.country && <span>{entry.country}</span>}
            <span>
              {formatDistanceToNow(new Date(entry.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  },
);
GuestbookCard.displayName = "GuestbookCard";
