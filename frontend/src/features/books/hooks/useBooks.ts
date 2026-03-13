import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface Book {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  price: string;
  fileUrl?: string;
  published: boolean;
  createdAt: string;
}

export const useBooksKey = {
  all: ["books"] as const,
  lists: () => [...useBooksKey.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...useBooksKey.lists(), { page, limit }] as const,
  detail: (slug: string) => [...useBooksKey.all, "detail", slug] as const,
};

export function useBooks(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: useBooksKey.list(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/books", {
        params: { page, limit, published: true },
      });
      return data.data;
    },
  });
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: useBooksKey.detail(slug),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`/books/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
