import React from "react";
interface NextPost {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    coverImage?: string;
    readTime?: number;
    createdAt: string;
    tags: string[];
}
interface NextPostCardProps {
    post: NextPost;
}
export declare const NextPostCard: React.NamedExoticComponent<NextPostCardProps>;
export {};
//# sourceMappingURL=NextPostCard.d.ts.map