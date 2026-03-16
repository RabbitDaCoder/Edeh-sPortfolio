import React, { useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Loader2, PenLine } from "lucide-react";
import { useGuestbookEntries } from "../features/guestbook/hooks/useGuestbook";
import { GuestbookCard } from "../features/guestbook/components/GuestbookCard";

export function GuestbookPage() {
  const navigate = useNavigate();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGuestbookEntries();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allEntries = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <>
      <Helmet>
        <title>Guestbook — Edeh Chinedu</title>
        <meta
          name="description"
          content="Sign the guestbook and leave a message for Edeh Chinedu."
        />
      </Helmet>

      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-accent mb-4">
            <BookOpen size={18} strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase tracking-widest">
              Guestbook
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary">
            Words That Echo Always
          </h1>
          <p className="mt-3 text-text-muted max-w-lg mx-auto text-sm sm:text-base">
            Leave a message, share a thought, or just say hello. Every voice
            matters here.
          </p>
          <button
            onClick={() => navigate("/guestbook/create")}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <PenLine size={16} strokeWidth={1.5} />
            Sign the Guestbook
          </button>
        </motion.div>

        {/* Entries — masonry layout */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              size={24}
              strokeWidth={1.5}
              className="animate-spin text-text-muted"
            />
          </div>
        ) : allEntries.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <BookOpen
              size={32}
              strokeWidth={1.5}
              className="mx-auto mb-3 opacity-40"
            />
            <p className="text-sm">No entries yet. Be the first to sign!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {allEntries.map((entry, i) => (
              <GuestbookCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-px" />

        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-8">
            <Loader2
              size={20}
              strokeWidth={1.5}
              className="animate-spin text-text-muted"
            />
          </div>
        )}
      </section>
    </>
  );
}
