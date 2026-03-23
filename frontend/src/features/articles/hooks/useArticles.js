import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useArticlesKey = {
    all: ["articles"],
    lists: () => [...useArticlesKey.all, "list"],
    list: (page, limit) => [...useArticlesKey.lists(), { page, limit }],
    detail: (slug) => [...useArticlesKey.all, "detail", slug],
};
export function useArticles(page = 1, limit = 10) {
    return useQuery({
        queryKey: useArticlesKey.list(page, limit),
        queryFn: async () => {
            const { data } = await apiClient.get("/articles", {
                params: { page, limit, published: true },
            });
            return data.data;
        },
    });
}
export function useArticle(slug) {
    return useQuery({
        queryKey: useArticlesKey.detail(slug),
        queryFn: async () => {
            const { data } = await apiClient.get(`/articles/${slug}`);
            return data.data;
        },
        enabled: !!slug,
    });
}
//# sourceMappingURL=useArticles.js.map