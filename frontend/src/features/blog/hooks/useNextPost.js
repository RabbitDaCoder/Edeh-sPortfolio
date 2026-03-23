import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export function useNextPost(slug) {
    return useQuery({
        queryKey: ["blog-next", slug],
        queryFn: async () => {
            const { data } = await apiClient.get(`/blog/${slug}/next`);
            return data.data;
        },
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
}
//# sourceMappingURL=useNextPost.js.map