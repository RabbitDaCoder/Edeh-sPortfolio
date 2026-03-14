import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { FeaturedPost } from "../components/blog/FeaturedPost";
import { BlogFilters } from "../components/blog/BlogFilters";
import { BlogGrid } from "../components/blog/BlogGrid";
import type { BlogPostData } from "../components/blog/FeaturedPost";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { breadcrumbSchema, collectionPageSchema } from "../lib/schemas";
import { SEO_DEFAULTS } from "../lib/seo";

const POSTS_PER_PAGE = 12;

// Static mock data — replace with API when backend is wired
const ALL_POSTS: BlogPostData[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  slug: `post-${i + 1}`,
  title: [
    "Mastering GSAP ScrollTrigger for Web Animations",
    "Building 3D Web Experiences with React Three Fiber",
    "TypeScript Best Practices in Modern React",
    "Performance Optimization Techniques",
    "Design Systems at Scale",
    "Modern CSS Animation Techniques",
    "Node.js Microservices Architecture",
    "WebGL Shaders for Creative Coding",
    "State Management with Zustand",
    "Building CLI Tools with TypeScript",
  ][i % 10],
  excerpt: [
    "Deep dive into advanced scroll-triggered animations with practical examples.",
    "Learn how to integrate Three.js into your React applications efficiently.",
    "Type safety patterns and strategies for large-scale React apps.",
    "Practical strategies to improve Core Web Vitals and user experience.",
    "Building and maintaining component libraries for enterprise applications.",
    "Explore CSS-in-JS, keyframes, and advanced animation patterns.",
    "Designing resilient microservices with event-driven patterns.",
    "Creative coding with fragment and vertex shaders in the browser.",
    "Lightweight global state without the boilerplate.",
    "Ship developer tools that feel native to the terminal.",
  ][i % 10],
  date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  readTime: `${5 + (i % 10)} min read`,
  category: [
    "Animation",
    "3D",
    "TypeScript",
    "Performance",
    "Design",
    "CSS",
    "Backend",
    "WebGL",
    "React",
    "Tooling",
  ][i % 10],
  featured: i === 0,
}));

const CATEGORIES = [...new Set(ALL_POSTS.map((p) => p.category))];

export const BlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!activeCategory) return ALL_POSTS;
    return ALL_POSTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const featured = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts
    .filter((p) => p.id !== featured?.id)
    .slice(0, visibleCount);
  const hasMore = gridPosts.length < filteredPosts.length - 1;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
      setIsLoading(false);
    }, 300);
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
      <Section id="blog-page">
        <div className="space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-display-xl font-serif text-text-primary mb-2">
              Blog
            </h1>
            <p className="text-text-muted max-w-2xl">
              Insights, tutorials, and thoughts on web development, animations,
              and design systems.
            </p>
          </div>

          {/* Featured post */}
          {featured && <FeaturedPost post={featured} />}

          {/* Filters */}
          <BlogFilters
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Grid with infinite scroll */}
          <BlogGrid
            posts={gridPosts}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </div>
      </Section>
    </PageWrapper>
  );
};
