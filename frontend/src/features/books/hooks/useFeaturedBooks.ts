import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

export function useFeaturedBooks(limit: number = 3) {
  return useQuery({
    queryKey: ["books", "featured", limit],
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/books/featured", {
        params: { limit },
      });
      return data.data;
    },
  });
}
