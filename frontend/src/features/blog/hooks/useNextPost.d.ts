interface NextBlog {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    coverImage?: string;
    readTime?: number;
    createdAt: string;
    tags: string[];
}
export declare function useNextPost(slug: string): import("@tanstack/react-query").UseQueryResult<NextBlog | null, Error>;
export {};
//# sourceMappingURL=useNextPost.d.ts.map