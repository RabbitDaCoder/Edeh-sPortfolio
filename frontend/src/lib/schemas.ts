import { PERSON_SCHEMA_BASE, SEO_DEFAULTS } from "./seo";

export function personSchema() {
  return {
    ...PERSON_SCHEMA_BASE,
    "@context": "https://schema.org",
    logo: {
      "@type": "ImageObject",
      url: `${SEO_DEFAULTS.siteUrl}/chevron.png`,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edeh Chinedu Daniel",
    url: SEO_DEFAULTS.siteUrl,
    description: SEO_DEFAULTS.defaultDescription,
    author: { "@id": SEO_DEFAULTS.siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_DEFAULTS.siteUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  readTime: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? SEO_DEFAULTS.defaultOgImage,
    url: `${SEO_DEFAULTS.siteUrl}/blog/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt ?? post.createdAt,
    author: {
      "@type": "Person",
      name: "Edeh Chinedu Daniel",
      url: SEO_DEFAULTS.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Edeh Chinedu Daniel",
      url: SEO_DEFAULTS.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_DEFAULTS.siteUrl}/chevron.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_DEFAULTS.siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readTime}M`,
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: post.category,
    },
  };
}

export function bookSchema(book: {
  title: string;
  slug: string;
  description: string;
  coverImage?: string | null;
  author?: string;
  price?: number;
  currency?: string;
  publishedAt?: string;
  tags?: string[];
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    image: book.coverImage ?? SEO_DEFAULTS.defaultOgImage,
    url: `${SEO_DEFAULTS.siteUrl}/books/${book.slug}`,
    author: {
      "@type": "Person",
      name: book.author ?? "Edeh Chinedu Daniel",
      url: SEO_DEFAULTS.siteUrl,
    },
    ...(book.publishedAt && { datePublished: book.publishedAt }),
    ...(book.price && {
      offers: {
        "@type": "Offer",
        price: book.price,
        priceCurrency: book.currency ?? "USD",
        availability: "https://schema.org/InStock",
        url: book.url ?? `${SEO_DEFAULTS.siteUrl}/books/${book.slug}`,
      },
    }),
    ...(book.tags && { keywords: book.tags.join(", ") }),
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function contactPageSchema() {
  const {
    "@type": _type,
    "@context": _ctx,
    ...personFields
  } = PERSON_SCHEMA_BASE;
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Edeh Chinedu Daniel",
    url: `${SEO_DEFAULTS.siteUrl}/contact`,
    description:
      "Get in touch with Edeh Chinedu Daniel for freelance " +
      "projects, consulting, or full-time opportunities.",
    mainEntity: {
      "@context": "https://schema.org",
      "@type": "Person",
      ...personFields,
      contactPoint: {
        "@type": "ContactPoint",
        email: "edehchinedu59@gmail.com",
        contactType: "professional enquiries",
        availableLanguage: "English",
      },
    },
  };
}
