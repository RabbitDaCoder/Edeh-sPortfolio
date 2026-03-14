import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { EXPERIENCES } from "../../../data/portfolio";

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

const TYPE_REVERSE: Record<string, CareerEntry["type"]> = {
  work: "JOB",
  founder: "FREELANCE",
  education: "EDUCATION",
};

const FALLBACK_ENTRIES: CareerEntry[] = EXPERIENCES.map((e) => ({
  id: e.id,
  type: TYPE_REVERSE[e.type] ?? "JOB",
  title: e.role,
  organisation: e.organisation,
  description: e.description,
  startDate: e.period.split(" — ")[0] + "-01-01",
  endDate: e.period.includes("Present") ? undefined : e.period.split(" — ")[1] + "-01-01",
  current: e.period.includes("Present"),
}));

export const useCareerKey = {
  all: ["career"] as const,
  detail: (type?: string) =>
    type ? [...useCareerKey.all, type] : ([...useCareerKey.all] as const),
};

export function useCareerTimeline(type?: string) {
  return useQuery({
    queryKey: useCareerKey.detail(type),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<any>("/career", {
          params: type ? { type } : {},
        });
        const items = data.data;
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
