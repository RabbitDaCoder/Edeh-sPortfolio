import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';
import { SEO } from '../components/seo/SEO';
import { JsonLD } from '../components/seo/JsonLD';
import { breadcrumbSchema, collectionPageSchema } from '../lib/schemas';
import { SEO_DEFAULTS } from '../lib/seo';

export const BooksPage: React.FC = () => {
  const books = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    title: `Book Title ${i + 1}`,
    author: 'Edeh Chinedu Daniel',
    year: 2020 + (i % 4),
    description: 'A great book about web development and design systems.',
    price: '$29.99',
  }));

  const seo = useSEO({
    title: 'Books — Recommended Reading',
    description:
      'Books recommended and written by Edeh Chinedu Daniel on ' +
      'software engineering, product building, and creative technology.',
    canonical: 'https://edehchinedu.dev/books',
    ogType: 'website',
    keywords: [
      'Engineering Books',
      'Software Development Books',
      'RabbitDaCoder Reading List',
      'Tech Books Nigeria',
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
          { name: 'Home', url: 'https://edehchinedu.dev' },
          { name: 'Books', url: 'https://edehchinedu.dev/books' },
        ])}
      />
      <JsonLD
        schema={collectionPageSchema({
          name: 'Books — Edeh Chinedu Daniel',
          description: 'Books recommended and written by Edeh Chinedu Daniel on software engineering and creative technology.',
          url: `${SEO_DEFAULTS.siteUrl}/books`,
          items: books.map((b) => ({
            name: b.title,
            url: `${SEO_DEFAULTS.siteUrl}/books/${b.id}`,
          })),
        })}
      />
      <Section id="books-page">
        <div className="space-y-12">
          <div>
            <h1 className="text-display-xl font-serif text-text-primary mb-2">
              Books
            </h1>
            <p className="text-text-muted max-w-2xl">
              Deep dives into advanced web development topics, design patterns,
              and practical strategies for building scalable applications.
            </p>
          </div>

          {/* Books grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Card
                key={book.id}
                hover="tilt"
                className="flex flex-col space-y-4"
              >
                {/* Cover placeholder */}
                <div className="w-full h-64 bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm flex items-center justify-center border border-border">
                  <span className="text-text-muted">Book Cover</span>
                </div>

                <div className="flex-1 p-4 flex flex-col space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {book.author}
                    </p>
                  </div>

                  <p className="text-sm text-text-muted line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex flex-col">
                      <Badge variant="outline" className="text-xs w-fit">
                        {book.year}
                      </Badge>
                      <span className="text-lg font-semibold text-text-primary mt-1">
                        {book.price}
                      </span>
                    </div>
                    <Button variant="primary" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};