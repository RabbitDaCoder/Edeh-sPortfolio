import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { TECHNOLOGIES } from "../../../data/portfolio";
import type { Technology, TechCategory } from "../../../data/portfolio";

export const useSkillsKey = {
  all: ["skills"] as const,
};

const CATEGORY_MAP: Record<string, TechCategory> = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  DATABASE: "database",
  DEVOPS: "devops",
  THREED: "3d",
  TOOLS: "tools",
};

export function useSkills() {
  return useQuery({
    queryKey: useSkillsKey.all,
    queryFn: async (): Promise<Technology[]> => {
      try {
        const { data } = await apiClient.get("/skills");
        const items = data.data;
        if (!items?.length) return TECHNOLOGIES;
        return items.map((s: any) => ({
          name: s.name,
          category: CATEGORY_MAP[s.category] ?? "tools",
        }));
      } catch {
        return TECHNOLOGIES;
      }
    },
    placeholderData: TECHNOLOGIES,
    retry: 1,
  });
}
