import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface AchievementEntry {
  id: string;
  title: string;
  description?: string;
  date?: string;
  order: number;
  createdAt: string;
}

export const useAchievementsKey = {
  all: ["achievements"] as const,
};

export function useAchievements() {
  return useQuery({
    queryKey: useAchievementsKey.all,
    queryFn: async (): Promise<AchievementEntry[]> => {
      const { data } = await apiClient.get<any>("/achievements");
      return data.data ?? [];
    },
    retry: 1,
  });
}
