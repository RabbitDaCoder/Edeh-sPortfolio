import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  tags: string[];
}

interface ArticlePost extends Article {
  content: string;
}

export const useArticlesKey = {
  all: ["articles"] as const,
  lists: () => [...useArticlesKey.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...useArticlesKey.lists(), { page, limit }] as const,
  detail: (slug: string) => [...useArticlesKey.all, "detail", slug] as const,
};

export function useArticles(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: useArticlesKey.list(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/articles", {
        params: { page, limit, published: true },
      });
      return data.data;
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: useArticlesKey.detail(slug),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`/articles/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
