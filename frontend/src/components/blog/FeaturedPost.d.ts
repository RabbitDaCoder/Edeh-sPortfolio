import React from "react";
export interface BlogPostData {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    featured?: boolean;
    coverColor?: string;
}
interface FeaturedPostProps {
    post: BlogPostData;
}
export declare const FeaturedPost: React.FC<FeaturedPostProps>;
export {};
//# sourceMappingURL=FeaturedPost.d.ts.map