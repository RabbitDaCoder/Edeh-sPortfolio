import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';
import { SEO } from '../components/seo/SEO';
import { JsonLD } from '../components/seo/JsonLD';
import { bookSchema, breadcrumbSchema } from '../lib/schemas';

export const BooksDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const book = {
    title: `Book: ${slug}`,
    author: 'Edeh Chinedu Daniel',
    price: '$29.99',
    year: 2023,
    description:
      'A comprehensive guide to modern web development and design systems.',
    longDescription: `
      This book covers advanced topics in web development, including:
      - Building scalable design systems
      - Advanced React patterns
      - Performance optimization
      - Animation techniques with GSAP and Framer Motion
      - 3D web graphics with Three.js
    `,
    pages: 450,
    isbn: '123-456-789',
  };

  const seo = useSEO({
    title: book.title,
    description: book.description,
    canonical: `https://edehchinedu.dev/books/${slug}`,
    ogType: 'book',
    ogTitle: book.title,
    ogDescription: book.description,
    twitterTitle: book.title,
    twitterDesc: book.description,
    keywords: [
      book.title,
      'Edeh Chinedu Daniel',
      'RabbitDaCoder Book',
      'Engineering Book',
    ],
  });

  return (
    <PageWrapper
      title={`${book.title} | Books`}
      description={book.description}
    >
      <SEO {...seo} />
      <JsonLD
        schema={bookSchema({
          title: book.title,
          slug: slug || '',
          description: book.description,
          price: 29.99,
        })}
      />
      <JsonLD
        schema={breadcrumbSchema([
          { name: 'Home', url: 'https://edehchinedu.dev' },
          { name: 'Books', url: 'https://edehchinedu.dev/books' },
          { name: book.title, url: `https://edehchinedu.dev/books/${slug}` },
        ])}
      />
      <Section id="book-detail">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Book cover and purchase */}
          <div className="space-y-6">
            {/* Cover */}
            <div className="w-full aspect-[3/4] bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm border border-border flex items-center justify-center sticky top-24">
              <span className="text-text-muted">Book Cover</span>
            </div>

            {/* Purchase CTA */}
            <Card className="p-6 space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">
                  Price
                </p>
                <p className="text-3xl font-serif font-semibold text-text-primary">
                  {book.price}
                </p>
              </div>
              <Button variant="primary" size="lg" className="w-full">
                Buy Now
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Preview
              </Button>

              {/* Book info */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-muted">Pages</p>
                  <p className="text-sm text-text-primary">{book.pages}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">ISBN</p>
                  <p className="text-sm text-text-primary font-mono">
                    {book.isbn}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Book details */}
          <div className="md:col-span-2 space-y-8">
            <header className="space-y-4">
              <h1 className="text-display-lg font-serif text-text-primary">
                {book.title}
              </h1>
              <p className="text-lg text-text-muted">{book.author}</p>
              <div className="flex items-center gap-3">
                <Badge variant="muted">{book.year}</Badge>
                <Badge variant="outline">New Release</Badge>
              </div>
            </header>

            <div className="space-y-6 text-text-muted leading-relaxed prose prose-invert max-w-none">
              <p>{book.description}</p>
              <p>{book.longDescription}</p>

              <div>
                <h3 className="text-text-primary font-semibold mb-3">
                  What You'll Learn
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Modern web development best practices</li>
                  <li>Scalable architecture patterns</li>
                  <li>Performance optimization strategies</li>
                  <li>Advanced animation techniques</li>
                  <li>3D web graphics and WebGL</li>
                </ul>
              </div>
            </div>

            {/* Reviews section */}
            <Card className="p-6 space-y-4 bg-surface/50">
              <h3 className="text-text-primary font-semibold">Reviews</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-border last:border-0">
                    <p className="text-sm font-semibold text-text-primary">
                      Reviewer {i}
                    </p>
                    <p className="text-sm text-text-muted">
                      ⭐⭐⭐⭐⭐ - This is an excellent book!
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};