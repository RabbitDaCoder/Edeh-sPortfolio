import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface CareerEntry {
  id: string;
  type:
    | "EDUCATION"
    | "JOB"
    | "FREELANCE"
    | "VOLUNTEER"
    | "ACHIEVEMENT"
    | "PLAN"
    | "BLOCKCHAIN"
    | "FOUNDER";
  title: string;
  organisation?: string;
  description?: string;
  date?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  points?: string[];
  keySkills?: string[];
  order?: number;
}

export const useCareerKey = {
  all: ["career"] as const,
  detail: (type?: string) =>
    type ? [...useCareerKey.all, type] : ([...useCareerKey.all] as const),
};

export function useCareerTimeline(type?: string) {
  return useQuery({
    queryKey: useCareerKey.detail(type),
    queryFn: async (): Promise<CareerEntry[]> => {
      const { data } = await apiClient.get<any>("/career", {
        params: type ? { type } : {},
      });
      return data.data ?? [];
    },
    retry: 1,
  });
}
