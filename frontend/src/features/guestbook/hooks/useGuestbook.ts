import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiV2Client } from "../../../lib/axios";

export interface GuestbookEntry {
  id: string;
  name: string;
  handle?: string | null;
  message: string;
  pinned: boolean;
  country?: string | null;
  createdAt: string;
  isFirstPost?: boolean;
}

interface GuestbookPage {
  data: GuestbookEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface CreateGuestbookPayload {
  name: string;
  email: string;
  message: string;
  handle?: string;
}

export const guestbookKeys = {
  all: ["guestbook"] as const,
  list: () => [...guestbookKeys.all, "list"] as const,
};

export function useGuestbookEntries() {
  return useInfiniteQuery<GuestbookPage>({
    queryKey: guestbookKeys.list(),
    queryFn: async ({ pageParam }) => {
      const { data } = await apiV2Client.get<{
        success: boolean;
        data: GuestbookPage;
      }>("/guestbook", { params: { page: pageParam } });
      return data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
  });
}

export function useCreateGuestbookEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGuestbookPayload) => {
      const { data } = await apiV2Client.post("/guestbook", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestbookKeys.all });
    },
  });
}
