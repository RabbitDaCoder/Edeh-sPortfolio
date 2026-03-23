import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { ACHIEVEMENTS } from "../../../data/portfolio";
const FALLBACK_ENTRIES = ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date,
    order: a.order,
    createdAt: new Date().toISOString(),
}));
export const useAchievementsKey = {
    all: ["achievements"],
};
export function useAchievements() {
    return useQuery({
        queryKey: useAchievementsKey.all,
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/achievements");
                const items = data.data;
                if (!items?.length)
                    return FALLBACK_ENTRIES;
                return items;
            }
            catch {
                return FALLBACK_ENTRIES;
            }
        },
        placeholderData: FALLBACK_ENTRIES,
        retry: 1,
    });
}
//# sourceMappingURL=useAchievements.js.map