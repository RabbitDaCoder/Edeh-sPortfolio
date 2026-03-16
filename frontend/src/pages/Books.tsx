import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useBooks } from "../features/books/hooks/useBooks";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildBooksListSchema,
} from "../lib/schemas";
import { SEO_DEFAULTS } from "../lib/seo";

interface BookItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  price: string;
  fileUrl?: string;
  published: boolean;
  createdAt: string;
}

export const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useBooks(1, 50);

  const books: BookItem[] = useMemo(() => {
    const raw = Array.isArray(data) ? data : (data?.data ?? data?.books ?? []);
    return raw as BookItem[];
  }, [data]);

  const seo = useSEO({
    title: "Books — Recommended Reading",
    description:
      "Books recommended and written by Edeh Chinedu Daniel on " +
      "software engineering, product building, and creative technology.",
    canonical: "https://edehchinedu.dev/books",
    ogType: "website",
    keywords: [
      "Engineering Books",
      "Software Development Books",
      "RabbitDaCoder Reading List",
      "Tech Books Nigeria",
    ],
  });

  return (
    <PageWrapper
      title="Books | Edeh Chinedu Daniel"
      description="My published books on web development, design systems, and JavaScript."
    >
      <SEO {...seo} />
      <JsonLD
        schema={breadcrumbSchema([
          { name: "Home", url: "https://edehchinedu.dev" },
          { name: "Books", url: "https://edehchinedu.dev/books" },
        ])}
      />
      <JsonLD
        schema={collectionPageSchema({
          name: "Books — Edeh Chinedu Daniel",
          description:
            "Books recommended and written by Edeh Chinedu Daniel on software engineering and creative technology.",
          url: `${SEO_DEFAULTS.siteUrl}/books`,
          items: books.map((b) => ({
            name: b.title,
            url: `${SEO_DEFAULTS.siteUrl}/books/${b.slug}`,
          })),
        })}
      />
      {books.length > 0 && (
        <JsonLD
          schema={buildBooksListSchema(
            books.map((b) => ({
              title: b.title,
              slug: b.slug,
              coverImage: b.coverImage,
              description: b.description,
            })),
          )}
        />
      )}

      {/* Hero strip */}
      <div
        className="relative flex items-end px-4 md:px-8 lg:px-16 pb-10 pt-24 md:pt-32"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-6xl mx-auto w-full flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
              Reading
            </span>
            <h1
              className="font-serif font-normal text-white mt-2"
              style={{ fontSize: "clamp(3rem,8vw,6rem)" }}
            >
              Books &amp; Resources
            </h1>
            <p className="font-sans text-base text-white/60 mt-3 max-w-md">
              Deep dives into engineering, design, and building things that
              last.
            </p>
          </div>
          <span
            className="hidden lg:block font-serif text-white pointer-events-none select-none"
            style={{ fontSize: "10rem", opacity: 0.03, lineHeight: 1 }}
          >
            Books
          </span>
        </div>
      </div>

      <Section id="books-page">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-surface animate-pulse rounded-sm"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && books.length === 0 && (
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
              <BookOpen size={20} strokeWidth={1} className="text-white/30" />
            </div>
            <h2
              className="font-serif font-normal text-white/80"
              style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              No books listed yet.
            </h2>
            <p className="font-sans text-[0.95rem] text-white/35 max-w-[360px] leading-relaxed">
              Books and resources are on the way. Check back soon.
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

        {/* Books grid */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Card
                key={book.id}
                hover="tilt"
                className="flex flex-col space-y-4 cursor-pointer"
                onClick={() => navigate(`/books/${book.slug}`)}
              >
                {/* Cover */}
                <div className="w-full h-64 bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm flex items-center justify-center border border-border overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-text-muted font-serif text-lg">
                      {book.title}
                    </span>
                  )}
                </div>

                <div className="flex-1 p-4 flex flex-col space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Edeh Chinedu Daniel
                    </p>
                  </div>

                  <p className="text-sm text-text-muted line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <div className="flex flex-col">
                      <Badge variant="outline" className="text-xs w-fit">
                        {new Date(book.createdAt).getFullYear()}
                      </Badge>
                      {book.price && (
                        <span className="text-lg font-semibold text-text-primary mt-1">
                          {book.price}
                        </span>
                      )}
                    </div>
                    <Button variant="primary" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </PageWrapper>
  );
};
