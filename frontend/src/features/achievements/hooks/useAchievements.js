import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useAchievementsKey = {
    all: ["achievements"],
};
export function useAchievements() {
    return useQuery({
        queryKey: useAchievementsKey.all,
        queryFn: async () => {
            const { data } = await apiClient.get("/achievements");
            return data.data ?? [];
        },
        retry: 1,
    });
}
//# sourceMappingURL=useAchievements.js.map