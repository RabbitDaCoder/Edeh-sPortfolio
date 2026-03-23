import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiV2Client } from "../lib/axios";

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

// Poll unread count every 30s — powers the badge on the bell icon
export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: ["notifications-unread"],
    queryFn: () =>
      apiV2Client
        .get("/admin/notifications/unread-count")
        .then((r: AxiosResponse) => r.data.data),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
}

// Full notification list — only fetched when the dropdown is open
export function useNotifications(enabled: boolean) {
  return useQuery<{
    notifications: Notification[];
    unreadCount: number;
    total: number;
  }>({
    queryKey: ["notifications"],
    queryFn: () =>
      apiV2Client
        .get("/admin/notifications", { params: { limit: 15 } })
        .then((r: AxiosResponse) => r.data.data),
    enabled,
    staleTime: 0,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiV2Client
        .patch(`/admin/notifications/${id}/read`)
        .then((r: AxiosResponse) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiV2Client
        .patch("/admin/notifications/read-all")
        .then((r: AxiosResponse) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}
