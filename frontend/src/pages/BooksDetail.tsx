import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useBook } from "../features/books/hooks/useBooks";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { bookSchema, breadcrumbSchema } from "../lib/schemas";

export const BooksDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: book, isLoading, isError } = useBook(slug || "");

  // Redirect on 404
  useEffect(() => {
    if (isError) navigate("/books", { replace: true });
  }, [isError, navigate]);

  const title = book?.title ?? "";
  const description = book?.description ?? "";
  const price = book?.price ?? "";
  const coverImage = book?.coverImage;
  const fileUrl = book?.fileUrl;
  const createdAt = book?.createdAt ?? "";

  const seo = useSEO({
    title: title || "Book",
    description,
    canonical: `https://edehchinedu.dev/books/${slug}`,
    ogType: "book",
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDesc: description,
    keywords: [
      title,
      "Edeh Chinedu Daniel",
      "RabbitDaCoder Book",
      "Engineering Book",
    ],
  });

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper title="Loading..." description="">
        <Section id="book-detail">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
            <div className="space-y-6">
              <div className="w-full aspect-[3/4] bg-surface animate-pulse rounded-sm" />
              <div className="h-32 bg-surface animate-pulse rounded-sm" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-10 w-3/4 bg-surface animate-pulse rounded" />
              <div className="h-4 w-1/3 bg-surface animate-pulse rounded" />
              <div className="space-y-3 mt-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-surface animate-pulse rounded"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  if (!book) return null;

  return (
    <PageWrapper title={`${title} | Books`} description={description}>
      <SEO {...seo} />
      <JsonLD
        schema={bookSchema({
          title,
          slug: slug || "",
          description,
          price: parseFloat(String(price)) || 0,
        })}
      />
      <JsonLD
        schema={breadcrumbSchema([
          { name: "Home", url: "https://edehchinedu.dev" },
          { name: "Books", url: "https://edehchinedu.dev/books" },
          { name: title, url: `https://edehchinedu.dev/books/${slug}` },
        ])}
      />
      <Section id="book-detail">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Books
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left: Book cover and purchase */}
            <div className="space-y-6">
              {/* Cover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full aspect-[3/4] bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm border border-border flex items-center justify-center sticky top-24 overflow-hidden"
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-text-muted font-serif text-lg px-4 text-center">
                    {title}
                  </span>
                )}
              </motion.div>

              {/* Purchase CTA */}
              <Card className="p-6 space-y-4">
                {price && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">
                      Price
                    </p>
                    <p className="text-3xl font-serif font-semibold text-text-primary">
                      {price}
                    </p>
                  </div>
                )}
                {fileUrl && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open(fileUrl, "_blank", "noopener")}
                  >
                    Get Book
                  </Button>
                )}
              </Card>
            </div>

            {/* Right: Book details */}
            <div className="md:col-span-2 space-y-8">
              <header className="space-y-4">
                <h1 className="text-display-lg font-serif text-text-primary">
                  {title}
                </h1>
                <p className="text-lg text-text-muted">Edeh Chinedu Daniel</p>
                <div className="flex items-center gap-3">
                  {createdAt && (
                    <Badge variant="muted">
                      {new Date(createdAt).getFullYear()}
                    </Badge>
                  )}
                </div>
              </header>

              <div className="space-y-6 text-text-muted leading-relaxed prose prose-invert max-w-none">
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};
