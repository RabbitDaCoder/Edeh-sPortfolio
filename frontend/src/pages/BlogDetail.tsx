import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { blogPostSchema, breadcrumbSchema } from "../lib/schemas";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

// Mock post data — in production, fetch from API
function getPost(slug: string) {
  return {
    title:
      slug
        ?.split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Blog Post",
    excerpt: "A deep dive into modern web development patterns and practices.",
    content: `
## Introduction

This article explores advanced techniques in modern web development. We'll cover key patterns that help build performant, maintainable applications.

## Core Concepts

Understanding the fundamentals is crucial before diving into advanced patterns. Here we break down the building blocks that power modern web experiences.

### Component Architecture

Well-structured components form the backbone of any scalable application. We look at composition patterns, prop drilling solutions, and state boundaries.

### Performance Patterns

From code splitting to memoization, these patterns ensure your application remains fast as it scales.

## Implementation

Let's walk through a practical example that demonstrates these concepts in action. Each step builds on the previous one.

### Setting Up

First, we establish our project structure and tooling. A solid foundation prevents issues down the road.

### Building the Core

With the foundation in place, we implement the core functionality step by step.

## Advanced Techniques

Once comfortable with the basics, these advanced techniques unlock new possibilities for your applications.

## Conclusion

Modern web development rewards those who invest in solid patterns and architecture. The techniques covered here provide a strong foundation for building scalable applications.
    `.trim(),
    date: new Date().toISOString(),
    readTime: "8 min read",
    category: "React",
    author: "Edeh Chinedu Daniel",
  };
}

const RELATED_POSTS = [
  {
    slug: "post-2",
    title: "Building 3D Web Experiences with React Three Fiber",
  },
  { slug: "post-3", title: "TypeScript Best Practices in Modern React" },
  { slug: "post-4", title: "Performance Optimization Techniques" },
];

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = useMemo(() => getPost(slug || ""), [slug]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("");

  // Parse ToC from markdown-style headings
  const tocEntries = useMemo<TocEntry[]>(() => {
    const lines = post.content.split("\n");
    const entries: TocEntry[] = [];
    lines.forEach((line) => {
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
  }, [post.content]);

  // Render content as basic HTML (in production use MDX or remark)
  const htmlContent = useMemo(() => {
    return post.content
      .replace(
        /^### (.+)$/gm,
        '<h3 id="$ID" class="text-xl font-semibold text-text-primary mt-10 mb-4">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 id="$ID" class="text-display-md font-serif text-text-primary mt-12 mb-6">$1</h2>',
      )
      .replace(
        /^(?!<h[23])((?!\s*$).+)$/gm,
        '<p class="text-body-md text-text-muted mb-4 leading-relaxed">$1</p>',
      )
      .replace(/<h([23]) id="\$ID"/g, (_match, level) => {
        // Generate proper IDs for headings
        return `<h${level} id="PLACEHOLDER_ID"`;
      });
  }, [post.content]);

  // Generate proper HTML with heading IDs
  const processedHtml = useMemo(() => {
    let idIndex = 0;
    return htmlContent.replace(/id="PLACEHOLDER_ID"/g, () => {
      const entry = tocEntries[idIndex];
      idIndex++;
      return entry ? `id="${entry.id}"` : 'id=""';
    });
  }, [htmlContent, tocEntries]);

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
    title: post.title,
    description: post.excerpt,
    canonical: `https://edehchinedu.dev/blog/${slug}`,
    ogType: 'article',
    ogTitle: post.title,
    ogDescription: post.excerpt,
    publishedTime: post.date,
    author: 'Edeh Chinedu Daniel',
    section: post.category,
    tags: [post.category],
    keywords: [post.category, 'Edeh Chinedu Daniel', 'RabbitDaCoder'],
  });

  return (
    <PageWrapper title={`${post.title} | Blog`} description={post.excerpt}>
      <SEO {...seo} />
      <JsonLD
        schema={blogPostSchema({
          title: post.title,
          slug: slug || '',
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: [post.category],
          createdAt: post.date,
          readTime: 8,
        })}
      />
      <JsonLD
        schema={breadcrumbSchema([
          { name: 'Home', url: 'https://edehchinedu.dev' },
          { name: 'Blog', url: 'https://edehchinedu.dev/blog' },
          { name: post.title, url: `https://edehchinedu.dev/blog/${slug}` },
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

          {/* Parallax cover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 md:h-80 bg-surface rounded-md border border-border flex items-center justify-center mb-12 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <span className="text-display-lg font-serif text-text-muted/20 select-none">
              {post.category}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
            {/* Article content */}
            <article className="min-w-0">
              <header className="space-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <Badge variant="muted">{post.category}</Badge>
                  <span className="text-xs text-text-muted font-mono">
                    {post.readTime}
                  </span>
                </div>
                <h1 className="text-display-lg font-serif text-text-primary">
                  {post.title}
                </h1>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {post.author}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </header>

              <div
                ref={contentRef}
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              {/* Related posts */}
              <div className="mt-16 pt-8 border-t border-border space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {RELATED_POSTS.map((rp) => (
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
            </article>

            {/* Table of Contents — sticky sidebar */}
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
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};
