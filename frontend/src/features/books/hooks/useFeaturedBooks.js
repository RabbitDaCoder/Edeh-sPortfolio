import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export function useFeaturedBooks(limit = 3) {
    return useQuery({
        queryKey: ["books", "featured", limit],
        queryFn: async () => {
            const { data } = await apiClient.get("/books/featured", {
                params: { limit },
            });
            return data.data;
        },
    });
}
//# sourceMappingURL=useFeaturedBooks.js.map