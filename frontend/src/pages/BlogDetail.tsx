import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBlog, useBlogs } from "../features/blog/hooks/useBlog";
import { useNextPost } from "../features/blog/hooks/useNextPost";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { buildArticleSchema, breadcrumbSchema } from "../lib/schemas";
import { ReadingProgress } from "../components/blog/ReadingProgress";
import { NextPostCard } from "../components/blog/NextPostCard";
import ShareBar from "../components/blog/ShareBar";
import CommentsSection from "../features/blog/components/CommentsSection";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("");

  const { data: post, isLoading, isError } = useBlog(slug || "");
  const { data: nextPost } = useNextPost(slug ?? "");

  // Fetch a few recent posts for "related" sidebar
  const { data: recentData } = useBlogs(1, 5);
  const relatedPosts = useMemo(() => {
    const raw = Array.isArray(recentData)
      ? recentData
      : (recentData?.data ?? []);
    return (raw as Array<{ slug: string; title: string }>)
      .filter((p) => p.slug !== slug)
      .slice(0, 3);
  }, [recentData, slug]);

  // Redirect to /blog on 404
  useEffect(() => {
    if (isError) navigate("/blog", { replace: true });
  }, [isError, navigate]);

  // Derived fields
  const title = post?.title ?? "";
  const excerpt = post?.excerpt ?? "";
  const content = post?.content ?? "";
  const category =
    Array.isArray(post?.tags) && post.tags.length > 0 ? post.tags[0] : "Blog";
  const readTimeStr = post?.readTime
    ? `${post.readTime} min read`
    : "5 min read";
  const dateStr = post?.createdAt ?? post?.date ?? "";
  const author = "Edeh Chinedu Daniel";

  // Parse ToC from markdown-style headings
  const tocEntries = useMemo<TocEntry[]>(() => {
    const lines = content.split("\n");
    const entries: TocEntry[] = [];
    lines.forEach((line: string) => {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        entries.push({ id, text, level });
      }
    });
    return entries;
  }, [content]);

  // Render content as basic HTML
  const processedHtml = useMemo(() => {
    let idIndex = 0;
    const html = content
      .replace(
        /^### (.+)$/gm,
        '<h3 id="PLACEHOLDER_ID" class="text-xl font-semibold text-text-primary mt-10 mb-4">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 id="PLACEHOLDER_ID" class="text-display-md font-serif text-text-primary mt-12 mb-6">$1</h2>',
      )
      .replace(
        /^(?!<h[23])((?!\s*$).+)$/gm,
        '<p class="text-body-md text-text-muted mb-4 leading-relaxed">$1</p>',
      );

    return html.replace(/id="PLACEHOLDER_ID"/g, () => {
      const entry = tocEntries[idIndex];
      idIndex++;
      return entry ? `id="${entry.id}"` : 'id=""';
    });
  }, [content, tocEntries]);

  // Intersection observer for active ToC highlight
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const headings = el.querySelectorAll("h2, h3");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [processedHtml]);

  const seo = useSEO({
    title: title || "Blog Post",
    description: excerpt,
    canonical: `https://edehchinedu.dev/blog/${slug}`,
    ogType: "article",
    ogTitle: title,
    ogDescription: excerpt,
    publishedTime: dateStr,
    author,
    section: category,
    tags: Array.isArray(post?.tags) ? post.tags : [category],
    keywords: [category, "Edeh Chinedu Daniel", "RabbitDaCoder"],
  });

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper title="Loading..." description="">
        <Section id="blog-detail">
          <div className="max-w-4xl mx-auto space-y-6 py-16">
            <div className="h-8 w-48 bg-surface animate-pulse rounded" />
            <div className="h-64 bg-surface animate-pulse rounded" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-surface animate-pulse rounded"
                  style={{ width: `${70 + Math.random() * 30}%` }}
                />
              ))}
            </div>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  if (!post) return null;

  return (
    <PageWrapper title={`${title} | Blog`} description={excerpt}>
      <SEO {...seo} />
      <ReadingProgress />
      <JsonLD
        schema={buildArticleSchema({
          title,
          slug: slug || "",
          excerpt,
          content,
          category,
          tags: Array.isArray(post.tags) ? post.tags : [category],
          createdAt: dateStr,
          readTime: post.readTime ?? 5,
        })}
      />
      <JsonLD
        schema={breadcrumbSchema([
          { name: "Home", url: "https://edehchinedu.dev" },
          { name: "Blog", url: "https://edehchinedu.dev/blog" },
          { name: title, url: `https://edehchinedu.dev/blog/${slug}` },
        ])}
      />
      <Section id="blog-detail">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 md:h-80 bg-surface rounded-md border border-border flex items-center justify-center mb-12 overflow-hidden relative"
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                <span className="text-display-lg font-serif text-text-muted/20 select-none">
                  {category}
                </span>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
            {/* Article content */}
            <article className="min-w-0">
              <header className="space-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <Badge variant="muted">{category}</Badge>
                  <span className="text-xs text-text-muted font-mono">
                    {readTimeStr}
                  </span>
                </div>
                <h1 className="text-display-lg font-serif text-text-primary">
                  {title}
                </h1>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {author}
                    </p>
                    {dateStr && (
                      <p className="text-xs text-text-muted">
                        {new Date(dateStr).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <ShareBar title={title} slug={slug || ""} />
                </div>
              </header>

              <div
                id="article-body"
                ref={contentRef}
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-8 border-t border-border space-y-6">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Related Articles
                  </h3>
                  <div className="space-y-3">
                    {relatedPosts.map((rp) => (
                      <button
                        key={rp.slug}
                        onClick={() => navigate(`/blog/${rp.slug}`)}
                        className="flex items-center justify-between w-full p-4 border border-border rounded-md hover:border-text-muted/40 transition-colors text-left group"
                      >
                        <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                          {rp.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nextPost && <NextPostCard post={nextPost} />}

              <CommentsSection slug={slug || ""} />
            </article>

            {/* Table of Contents — sticky sidebar */}
            {tocEntries.length > 0 && (
              <aside className="hidden lg:block">
                <nav className="sticky top-24 space-y-1">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-mono">
                    On this page
                  </p>
                  {tocEntries.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(entry.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block text-sm transition-colors ${
                        entry.level === 3 ? "pl-4" : ""
                      } ${
                        activeId === entry.id
                          ? "text-text-primary font-medium"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {entry.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};
