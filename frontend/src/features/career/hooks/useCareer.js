import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useCareerKey = {
    all: ["career"],
    detail: (type) => type ? [...useCareerKey.all, type] : [...useCareerKey.all],
};
export function useCareerTimeline(type) {
    return useQuery({
        queryKey: useCareerKey.detail(type),
        queryFn: async () => {
            const { data } = await apiClient.get("/career", {
                params: type ? { type } : {},
            });
            return data.data ?? [];
        },
        retry: 1,
    });
}
//# sourceMappingURL=useCareer.js.map