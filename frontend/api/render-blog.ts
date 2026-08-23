import type { IncomingMessage, ServerResponse } from "node:http";

const API_BASE = "https://portfolio-endpoint-zhdj.onrender.com/api/v1";
const SITE_URL = "https://edehchinedu.dev";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  readTime?: number;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Prevents a literal "</script>" inside JSON-LD data from closing the tag early.
function escapeForScriptTag(json: string): string {
  return json.replace(/</g, "\\u003c");
}

function notFoundResponse(res: ServerResponse): void {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(
    `<!doctype html><html><head><title>Post not found — Edeh Chinedu Daniel</title><meta name="robots" content="noindex" /></head><body><h1>Post not found</h1></body></html>`,
  );
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/", "http://internal");
  const slug = url.searchParams.get("slug") ?? "";

  if (!slug) {
    res.statusCode = 400;
    res.end("Missing slug");
    return;
  }

  let post: BlogPost | null = null;
  try {
    const apiRes = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
    if (apiRes.ok) {
      const json = (await apiRes.json()) as { data?: BlogPost };
      post = json?.data ?? null;
    }
  } catch {
    post = null;
  }

  if (!post) {
    notFoundResponse(res);
    return;
  }

  const title = post.title;
  const excerpt = post.excerpt ?? "";
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const category = tags[0] ?? "Blog";
  const readTime = post.readTime ?? 5;
  const publishedIso = new Date(post.createdAt).toISOString();
  const modifiedIso = new Date(post.updatedAt ?? post.createdAt).toISOString();
  const image = post.coverImage || `${SITE_URL}/og-default.svg`;
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const fullTitle = `${title} — Edeh Chinedu Daniel`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: publishedIso,
    dateModified: modifiedIso,
    author: {
      "@type": "Person",
      name: "Edeh Chinedu Daniel",
      url: SITE_URL,
      sameAs: [
        "https://github.com/RabbitDaCoder",
        "https://www.linkedin.com/in/edehchinedu20",
        "https://x.com/EdehChinedu20",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Edeh Chinedu Daniel",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    keywords: tags.join(", "),
    articleSection: category,
    wordCount: post.content
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length,
    timeRequired: `PT${readTime}M`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: title, item: canonical },
    ],
  };

  const articleTagMetas = tags
    .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(excerpt)}" />
<meta name="author" content="Edeh Chinedu Daniel" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<link rel="canonical" href="${canonical}" />
${tags.length ? `<meta name="keywords" content="${escapeHtml(tags.join(", "))}" />` : ""}

<meta property="og:type" content="article" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${escapeHtml(fullTitle)}" />
<meta property="og:description" content="${escapeHtml(excerpt)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:site_name" content="Edeh Chinedu Daniel" />
<meta property="og:locale" content="en_NG" />
<meta property="article:published_time" content="${publishedIso}" />
<meta property="article:modified_time" content="${modifiedIso}" />
<meta property="article:author" content="Edeh Chinedu Daniel" />
<meta property="article:section" content="${escapeHtml(category)}" />
${articleTagMetas}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@EdehChinedu20" />
<meta name="twitter:creator" content="@EdehChinedu20" />
<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
<meta name="twitter:description" content="${escapeHtml(excerpt)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<script type="application/ld+json">${escapeForScriptTag(JSON.stringify(articleSchema))}</script>
<script type="application/ld+json">${escapeForScriptTag(JSON.stringify(breadcrumbSchema))}</script>
</head>
<body>
<article>
<h1>${escapeHtml(title)}</h1>
<p><em>By Edeh Chinedu Daniel — ${new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — ${readTime} min read</em></p>
${post.content}
</article>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.end(html);
}
