import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { PERSONAL } from "../../../data/portfolio";
import type { Personal } from "../../../data/portfolio";

export const useProfileKey = {
  all: ["profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: useProfileKey.all,
    queryFn: async (): Promise<Personal> => {
      try {
        const { data } = await apiClient.get("/profile");
        const p = data.data;
        if (!p) return PERSONAL;
        return {
          name: {
            first: p.firstName ?? PERSONAL.name.first,
            middle: p.middleName ?? PERSONAL.name.middle,
            last: p.lastName ?? PERSONAL.name.last,
          },
          tagline: p.tagline ?? PERSONAL.tagline,
          bio: [p.bio1 ?? PERSONAL.bio[0], p.bio2 ?? PERSONAL.bio[1]],
          pullQuote: p.pullQuote ?? PERSONAL.pullQuote,
          availability: p.availability ?? PERSONAL.availability,
          email: p.email ?? PERSONAL.email,
          location: p.location ?? PERSONAL.location,
          timezone: p.timezone ?? PERSONAL.timezone,
          github: p.github ?? PERSONAL.github,
          linkedin: p.linkedin ?? PERSONAL.linkedin,
          youtube: p.youtube ?? PERSONAL.youtube,
          twitter: p.twitter ?? PERSONAL.twitter,
        };
      } catch {
        return PERSONAL;
      }
    },
    placeholderData: PERSONAL,
    retry: 1,
  });
}
