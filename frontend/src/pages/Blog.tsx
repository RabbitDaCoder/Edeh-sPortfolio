import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { FeaturedPost } from "../components/blog/FeaturedPost";
import { BlogFilters } from "../components/blog/BlogFilters";
import { BlogGrid } from "../components/blog/BlogGrid";
import type { BlogPostData } from "../components/blog/FeaturedPost";
import { useBlogs } from "../features/blog/hooks/useBlog";
import { BLOG_CATEGORY_GROUPS } from "../constants/blog";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { breadcrumbSchema, collectionPageSchema } from "../lib/schemas";
import { SEO_DEFAULTS } from "../lib/seo";

const POSTS_PER_PAGE = 12;

export const BlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const { data, isLoading } = useBlogs(1, 100);

  // Normalize API response — may be { data: [...], pagination } or just [...]
  const allPosts: BlogPostData[] = useMemo(() => {
    const raw = Array.isArray(data) ? data : (data?.data ?? data?.blogs ?? []);
    return raw.map((post: Record<string, unknown>) => ({
      id: post.id as string,
      slug: post.slug as string,
      title: post.title as string,
      excerpt: (post.excerpt as string) ?? "",
      date: (post.createdAt as string) ?? (post.date as string) ?? "",
      readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
      category:
        (post.category as string) ??
        (Array.isArray(post.tags)
          ? ((post.tags[0] as string) ?? "Blog")
          : "Blog"),
      featured: (post.featured as boolean) ?? false,
      coverImage: post.coverImage as string | undefined,
    }));
  }, [data]);

  const categories = useMemo(() => BLOG_CATEGORY_GROUPS, []);

  const handleCategoryChange = useCallback(
    (cat: string) => {
      setVisibleCount(POSTS_PER_PAGE);
      if (cat) {
        setSearchParams({ category: cat });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams],
  );

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return allPosts;
    return allPosts.filter((p) => p.category === activeCategory);
  }, [activeCategory, allPosts]);

  const featured = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts
    .filter((p) => p.id !== featured?.id)
    .slice(0, visibleCount);
  const hasMore = gridPosts.length < filteredPosts.length - 1;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  }, []);

  const seo = useSEO({
    title: "Writing — Thoughts on Engineering & Design",
    description:
      "Articles, tutorials, and insights on full-stack engineering, " +
      "IoT systems, 3D web development, and building software in Nigeria.",
    canonical: "https://edehchinedu.dev/blog",
    ogType: "website",
    keywords: [
      "Web Development Blog Nigeria",
      "React Tutorials",
      "Node.js Articles",
      "IoT Engineering Blog",
      "Full-Stack Developer Writing",
      "RabbitDaCoder Blog",
    ],
  });

  return (
    <PageWrapper
      title="Blog | Edeh Chinedu Daniel"
      description="Articles about web development, design systems, and modern JavaScript."
    >
      <SEO {...seo} />
      <JsonLD
        schema={breadcrumbSchema([
          { name: "Home", url: "https://edehchinedu.dev" },
          { name: "Blog", url: "https://edehchinedu.dev/blog" },
        ])}
      />
      <JsonLD
        schema={collectionPageSchema({
          name: "Blog — Edeh Chinedu Daniel",
          description:
            "Articles, tutorials, and insights on full-stack engineering, IoT, and 3D web development.",
          url: `${SEO_DEFAULTS.siteUrl}/blog`,
          items: filteredPosts.slice(0, 20).map((p) => ({
            name: p.title,
            url: `${SEO_DEFAULTS.siteUrl}/blog/${p.slug}`,
          })),
        })}
      />

      {/* Hero strip */}
      <div
        className="relative flex items-end px-4 md:px-8 lg:px-16 pb-10 pt-24 md:pt-32"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-6xl mx-auto w-full flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
              Writing
            </span>
            <h1
              className="font-serif font-normal text-white mt-2"
              style={{ fontSize: "clamp(3rem,8vw,6rem)" }}
            >
              Words &amp; Ideas
            </h1>
            <p className="font-sans text-base text-white/60 mt-3 max-w-md">
              Thoughts on engineering, design, and building things that matter.
            </p>
          </div>
          <span
            className="hidden lg:block font-serif text-white pointer-events-none select-none"
            style={{ fontSize: "10rem", opacity: 0.03, lineHeight: 1 }}
          >
            Blog
          </span>
        </div>
      </div>

      <Section id="blog-page">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-surface animate-pulse rounded-sm"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allPosts.length === 0 && (
          <div
            className="relative flex flex-col items-center justify-center text-center gap-6 py-16"
            style={{ minHeight: "40vh" }}
          >
            <span
              className="absolute font-serif text-white/[0.04] select-none pointer-events-none"
              style={{ fontSize: "clamp(6rem,20vw,12rem)", lineHeight: 1 }}
            >
              0
            </span>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <PenLine size={20} strokeWidth={1} className="text-white/30" />
            </div>
            <h2
              className="font-serif font-normal text-white/80"
              style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              Nothing published yet.
            </h2>
            <p className="font-sans text-[0.95rem] text-white/35 max-w-[360px] leading-relaxed">
              First post coming soon. Ideas are being written, refined, and
              readied. Check back shortly.
            </p>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="w-1 h-1 rounded-full bg-white/40"
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && allPosts.length > 0 && (
          <div className="space-y-12">
            {featured && <FeaturedPost post={featured} />}

            {categories.length > 0 && (
              <BlogFilters
                categoryGroups={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}

            <BlogGrid
              posts={gridPosts}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              isLoading={false}
            />
          </div>
        )}
      </Section>
    </PageWrapper>
  );
};
