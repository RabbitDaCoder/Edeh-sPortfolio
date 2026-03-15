import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { ACHIEVEMENTS } from "../../../data/portfolio";

interface AchievementEntry {
  id: string;
  title: string;
  description?: string;
  date?: string;
  order: number;
  createdAt: string;
}

const FALLBACK_ENTRIES: AchievementEntry[] = ACHIEVEMENTS.map((a) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  date: a.date,
  order: a.order,
  createdAt: new Date().toISOString(),
}));

export const useAchievementsKey = {
  all: ["achievements"] as const,
};

export function useAchievements() {
  return useQuery({
    queryKey: useAchievementsKey.all,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<any>("/achievements");
        const items = data.data as AchievementEntry[];
        if (!items?.length) return FALLBACK_ENTRIES;
        return items;
      } catch {
        return FALLBACK_ENTRIES;
      }
    },
    placeholderData: FALLBACK_ENTRIES,
    retry: 1,
  });
}
