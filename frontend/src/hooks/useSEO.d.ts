export interface SEOData {
    title: string;
    description: string;
    canonical: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogType?: "website" | "article" | "book";
    twitterTitle?: string;
    twitterDesc?: string;
    twitterImage?: string;
    noIndex?: boolean;
    keywords?: string[];
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
}
export declare function useSEO(data: Partial<SEOData>): SEOData;
//# sourceMappingURL=useSEO.d.ts.map