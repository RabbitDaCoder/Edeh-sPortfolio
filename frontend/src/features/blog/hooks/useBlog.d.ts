export declare const useBlogsKey: {
    all: readonly ["blogs"];
    lists: () => readonly ["blogs", "list"];
    list: (page: number, limit: number) => readonly ["blogs", "list", {
        readonly page: number;
        readonly limit: number;
    }];
    detail: (slug: string) => readonly ["blogs", "detail", string];
};
export declare function useBlogs(page?: number, limit?: number): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useInfiniteBlogs(limit?: number): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<any, unknown>, Error>;
export declare function useBlog(slug: string): import("@tanstack/react-query").UseQueryResult<any, Error>;
//# sourceMappingURL=useBlog.d.ts.map