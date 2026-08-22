import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const usePolaroidsKey = {
    all: ["polaroids"],
};
export function usePolaroids() {
    return useQuery({
        queryKey: usePolaroidsKey.all,
        queryFn: async () => {
            const { data } = await apiClient.get("/polaroids?published=true");
            const items = data.data ?? [];
            return items.map((p) => ({
                id: p.id,
                src: p.src || "",
                alt: p.alt,
                caption: p.caption,
                rotation: p.rotation ?? 0,
            }));
        },
        retry: 1,
    });
}
//# sourceMappingURL=usePolaroids.js.map