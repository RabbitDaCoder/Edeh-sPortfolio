import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const commentKeys = {
    all: ["comments"],
    list: (slug, page) => [...commentKeys.all, slug, page],
};
export function useComments(slug, page = 1, limit = 20) {
    return useQuery({
        queryKey: commentKeys.list(slug, page),
        queryFn: async () => {
            const { data } = await apiClient.get(`/blog/${slug}/comments`, { params: { page, limit } });
            return data.data;
        },
        enabled: !!slug,
    });
}
export function useCreateComment(slug) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post(`/blog/${slug}/comments`, payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...commentKeys.all, slug] });
        },
    });
}
//# sourceMappingURL=useComments.js.map