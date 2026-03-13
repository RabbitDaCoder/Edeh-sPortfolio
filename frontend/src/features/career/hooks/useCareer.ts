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
    | "PLAN";
  title: string;
  organisation?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export const useCareerKey = {
  all: ["career"] as const,
  detail: (type?: string) =>
    type ? [...useCareerKey.all, type] : ([...useCareerKey.all] as const),
};

export function useCareerTimeline(type?: string) {
  return useQuery({
    queryKey: useCareerKey.detail(type),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/career", {
        params: type ? { type } : {},
      });
      return data.data;
    },
  });
}
