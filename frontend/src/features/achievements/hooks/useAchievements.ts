import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface AchievementEntry {
  id: string;
  title: string;
  description?: string;
  date?: string;
  createdAt: string;
}

export const useAchievementsKey = {
  all: ["achievements"] as const,
};

export function useAchievements() {
  return useQuery({
    queryKey: useAchievementsKey.all,
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/achievements");
      return data.data as AchievementEntry[];
    },
  });
}
