import React, { useRef, useEffect, useCallback } from "react";
import { BlogCard } from "./BlogCard";
import type { BlogPostData } from "./FeaturedPost";

interface BlogGridProps {
  posts: BlogPostData[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  hasMore,
  onLoadMore,
  isLoading,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <BlogCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-border border-t-text-primary rounded-full animate-spin" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-text-muted py-8">
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
};
