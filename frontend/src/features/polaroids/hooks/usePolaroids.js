import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { POLAROIDS } from "../../../data/portfolio";
export const usePolaroidsKey = {
    all: ["polaroids"],
};
export function usePolaroids() {
    return useQuery({
        queryKey: usePolaroidsKey.all,
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/polaroids?published=true");
                const items = data.data;
                if (!items?.length)
                    return POLAROIDS;
                return items.map((p) => ({
                    id: p.id,
                    src: p.src || "",
                    alt: p.alt,
                    caption: p.caption,
                    rotation: p.rotation ?? 0,
                }));
            }
            catch {
                return POLAROIDS;
            }
        },
        placeholderData: POLAROIDS,
        retry: 1,
    });
}
//# sourceMappingURL=usePolaroids.js.map