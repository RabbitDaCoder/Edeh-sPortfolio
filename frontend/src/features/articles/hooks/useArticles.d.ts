export declare const useArticlesKey: {
    all: readonly ["articles"];
    lists: () => readonly ["articles", "list"];
    list: (page: number, limit: number) => readonly ["articles", "list", {
        readonly page: number;
        readonly limit: number;
    }];
    detail: (slug: string) => readonly ["articles", "detail", string];
};
export declare function useArticles(page?: number, limit?: number): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useArticle(slug: string): import("@tanstack/react-query").UseQueryResult<any, Error>;
//# sourceMappingURL=useArticles.d.ts.map