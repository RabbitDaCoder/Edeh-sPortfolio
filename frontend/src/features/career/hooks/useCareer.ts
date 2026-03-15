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

const TYPE_REVERSE: Record<string, CareerEntry["type"]> = {
  work: "JOB",
  founder: "FOUNDER",
  education: "EDUCATION",
  freelance: "FREELANCE",
  volunteer: "VOLUNTEER",
  plan: "PLAN",
  blockchain: "BLOCKCHAIN",
};

const FALLBACK_ENTRIES: CareerEntry[] = EXPERIENCES.map((e) => ({
  id: e.id,
  type: TYPE_REVERSE[e.type] ?? "JOB",
  title: e.title,
  organisation: e.organisation,
  description: e.description,
  date: e.date,
  startDate: e.startDate,
  endDate: e.endDate ?? undefined,
  current: e.current,
  points: e.points,
  keySkills: e.keySkills,
  order: e.order,
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
