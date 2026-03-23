import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useBlogsKey = {
    all: ["blogs"],
    lists: () => [...useBlogsKey.all, "list"],
    list: (page, limit) => [...useBlogsKey.lists(), { page, limit }],
    detail: (slug) => [...useBlogsKey.all, "detail", slug],
};
export function useBlogs(page = 1, limit = 10) {
    return useQuery({
        queryKey: useBlogsKey.list(page, limit),
        queryFn: async () => {
            const { data } = await apiClient.get("/blog", {
                params: { page, limit, published: true },
            });
            return data.data;
        },
    });
}
export function useInfiniteBlogs(limit = 10) {
    return useInfiniteQuery({
        queryKey: [...useBlogsKey.lists(), { limit }],
        queryFn: async ({ pageParam }) => {
            const { data } = await apiClient.get("/blog", {
                params: { page: pageParam, limit, published: true },
            });
            return data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const current = lastPage.pagination.page;
            const pages = lastPage.pagination.pages;
            return current < pages ? current + 1 : undefined;
        },
    });
}
export function useBlog(slug) {
    return useQuery({
        queryKey: useBlogsKey.detail(slug),
        queryFn: async () => {
            const { data } = await apiClient.get(`/blog/${slug}`);
            return data.data;
        },
        enabled: !!slug,
    });
}
//# sourceMappingURL=useBlog.js.map