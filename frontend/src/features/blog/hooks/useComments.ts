import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface Comment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  website?: string | null;
  body: string;
  parentId: string | null;
  approved: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsResponse {
  data: Comment[];
  commentCount: number;
  commentsEnabled: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const commentKeys = {
  all: ["comments"] as const,
  list: (slug: string, page: number) =>
    [...commentKeys.all, slug, page] as const,
};

export function useComments(
  slug: string,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery<CommentsResponse>({
    queryKey: commentKeys.list(slug, page),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean;
        data: CommentsResponse;
      }>(`/blog/${slug}/comments`, { params: { page, limit } });
      return data.data;
    },
    enabled: !!slug,
  });
}

interface CreateCommentPayload {
  name: string;
  email: string;
  website?: string;
  body: string;
  parentId?: string;
}

export function useCreateComment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const { data } = await apiClient.post(`/blog/${slug}/comments`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...commentKeys.all, slug] });
    },
  });
}
