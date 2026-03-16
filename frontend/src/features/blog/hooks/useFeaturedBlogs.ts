import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

export function useFeaturedBlogs(limit: number = 3) {
  return useQuery({
    queryKey: ["blogs", "featured", limit],
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/blog/featured", {
        params: { limit },
      });
      return data.data;
    },
  });
}
