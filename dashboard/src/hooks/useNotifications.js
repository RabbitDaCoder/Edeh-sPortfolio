import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV2Client } from "../lib/axios";
// Poll unread count every 30s — powers the badge on the bell icon
export function useUnreadCount() {
    return useQuery({
        queryKey: ["notifications-unread"],
        queryFn: () => apiV2Client
            .get("/admin/notifications/unread-count")
            .then((r) => r.data.data),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        staleTime: 10000,
    });
}
// Full notification list — only fetched when the dropdown is open
export function useNotifications(enabled) {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => apiV2Client
            .get("/admin/notifications", { params: { limit: 15 } })
            .then((r) => r.data.data),
        enabled,
        staleTime: 0,
    });
}
export function useMarkRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiV2Client
            .patch(`/admin/notifications/${id}/read`)
            .then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
        },
    });
}
export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => apiV2Client
            .patch("/admin/notifications/read-all")
            .then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
        },
    });
}
//# sourceMappingURL=useNotifications.js.map