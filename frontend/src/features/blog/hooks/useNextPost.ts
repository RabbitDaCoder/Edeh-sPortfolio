import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface NextBlog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: number;
  createdAt: string;
  tags: string[];
}

export function useNextPost(slug: string) {
  return useQuery<NextBlog | null>({
    queryKey: ["blog-next", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean;
        data: NextBlog | null;
      }>(`/blog/${slug}/next`);
      return data.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}
