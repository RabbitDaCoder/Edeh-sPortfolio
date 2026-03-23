import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { EXPERIENCES } from "../../../data/portfolio";
const TYPE_REVERSE = {
    work: "JOB",
    founder: "FOUNDER",
    education: "EDUCATION",
    freelance: "FREELANCE",
    volunteer: "VOLUNTEER",
    plan: "PLAN",
    blockchain: "BLOCKCHAIN",
};
const FALLBACK_ENTRIES = EXPERIENCES.map((e) => ({
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
    all: ["career"],
    detail: (type) => type ? [...useCareerKey.all, type] : [...useCareerKey.all],
};
export function useCareerTimeline(type) {
    return useQuery({
        queryKey: useCareerKey.detail(type),
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/career", {
                    params: type ? { type } : {},
                });
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
//# sourceMappingURL=useCareer.js.map