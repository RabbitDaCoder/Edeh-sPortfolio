import { SEO_DEFAULTS } from "../lib/seo";
export function useSEO(data) {
    const base = SEO_DEFAULTS;
    const title = data.title
        ? `${data.title} — ${base.siteName}`
        : base.defaultTitle;
    return {
        title,
        description: data.description ?? base.defaultDescription,
        canonical: data.canonical ?? base.siteUrl,
        ogTitle: data.ogTitle ?? title,
        ogDescription: data.ogDescription ?? data.description ?? base.defaultDescription,
        ogImage: data.ogImage ?? base.defaultOgImage,
        ogImageAlt: data.ogImageAlt ?? base.defaultOgImageAlt,
        ogType: data.ogType ?? "website",
        twitterTitle: data.twitterTitle ?? title,
        twitterDesc: data.twitterDesc ?? data.description ?? base.defaultDescription,
        twitterImage: data.twitterImage ?? data.ogImage ?? base.defaultOgImage,
        noIndex: data.noIndex ?? false,
        keywords: data.keywords ?? [],
        publishedTime: data.publishedTime,
        modifiedTime: data.modifiedTime,
        author: data.author ?? "Edeh Chinedu Daniel",
        section: data.section,
        tags: data.tags ?? [],
    };
}
//# sourceMappingURL=useSEO.js.map