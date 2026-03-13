import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  views: number;
  createdAt: string;
  tags: string[];
}

interface BlogPost extends Blog {
  content: string;
  readTime?: number;
}

export const useBlogsKey = {
  all: ["blogs"] as const,
  lists: () => [...useBlogsKey.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...useBlogsKey.lists(), { page, limit }] as const,
  detail: (slug: string) => [...useBlogsKey.all, "detail", slug] as const,
};

export function useBlogs(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: useBlogsKey.list(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/blog", {
        params: { page, limit, published: true },
      });
      return data.data;
    },
  });
}

export function useInfiniteBlogs(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: [...useBlogsKey.lists(), { limit }],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<any>("/blog", {
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

export function useBlog(slug: string) {
  return useQuery({
    queryKey: useBlogsKey.detail(slug),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`/blog/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
