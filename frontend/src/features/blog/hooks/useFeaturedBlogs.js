import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export function useFeaturedBlogs(limit = 3) {
    return useQuery({
        queryKey: ["blogs", "featured", limit],
        queryFn: async () => {
            const { data } = await apiClient.get("/blog/featured", {
                params: { limit },
            });
            return data.data;
        },
    });
}
//# sourceMappingURL=useFeaturedBlogs.js.map