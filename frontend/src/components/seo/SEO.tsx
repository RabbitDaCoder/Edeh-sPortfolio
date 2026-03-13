import { Helmet } from 'react-helmet-async'
import { SEO_DEFAULTS } from '../../lib/seo'
import type { SEOData } from '../../hooks/useSEO'

export function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  ogType,
  twitterTitle,
  twitterDesc,
  twitterImage,
  noIndex,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: SEOData) {
  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      <meta property="og:locale" content={SEO_DEFAULTS.locale} />

      {/* Article-specific OG */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {ogType === 'article' &&
        tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter / X */}
      <meta name="twitter:card" content={SEO_DEFAULTS.twitterCardType} />
      <meta name="twitter:site" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:creator" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDesc} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Theme color */}
      <meta name="theme-color" content={SEO_DEFAULTS.themeColor} />
    </Helmet>
  )
}
