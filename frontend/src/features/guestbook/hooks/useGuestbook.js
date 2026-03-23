import { useInfiniteQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { apiV2Client } from "../../../lib/axios";
export const guestbookKeys = {
    all: ["guestbook"],
    list: () => [...guestbookKeys.all, "list"],
};
export function useGuestbookEntries() {
    return useInfiniteQuery({
        queryKey: guestbookKeys.list(),
        queryFn: async ({ pageParam }) => {
            const { data } = await apiV2Client.get("/guestbook", { params: { page: pageParam } });
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
        mutationFn: async (payload) => {
            const { data } = await apiV2Client.post("/guestbook", payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: guestbookKeys.all });
        },
    });
}
//# sourceMappingURL=useGuestbook.js.map