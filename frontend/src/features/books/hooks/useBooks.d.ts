export declare const useBooksKey: {
    all: readonly ["books"];
    lists: () => readonly ["books", "list"];
    list: (page: number, limit: number) => readonly ["books", "list", {
        readonly page: number;
        readonly limit: number;
    }];
    detail: (slug: string) => readonly ["books", "detail", string];
};
export declare function useBooks(page?: number, limit?: number): import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare function useBook(slug: string): import("@tanstack/react-query").UseQueryResult<any, Error>;
//# sourceMappingURL=useBooks.d.ts.map