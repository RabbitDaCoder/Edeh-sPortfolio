import React from "react";
import type { BlogPostData } from "./FeaturedPost";
interface BlogGridProps {
    posts: BlogPostData[];
    hasMore: boolean;
    onLoadMore: () => void;
    isLoading: boolean;
}
export declare const BlogGrid: React.FC<BlogGridProps>;
export {};
//# sourceMappingURL=BlogGrid.d.ts.map