import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useBooksKey = {
    all: ["books"],
    lists: () => [...useBooksKey.all, "list"],
    list: (page, limit) => [...useBooksKey.lists(), { page, limit }],
    detail: (slug) => [...useBooksKey.all, "detail", slug],
};
export function useBooks(page = 1, limit = 12) {
    return useQuery({
        queryKey: useBooksKey.list(page, limit),
        queryFn: async () => {
            const { data } = await apiClient.get("/books", {
                params: { page, limit, published: true },
            });
            return data.data;
        },
    });
}
export function useBook(slug) {
    return useQuery({
        queryKey: useBooksKey.detail(slug),
        queryFn: async () => {
            const { data } = await apiClient.get(`/books/${slug}`);
            return data.data;
        },
        enabled: !!slug,
    });
}
//# sourceMappingURL=useBooks.js.map