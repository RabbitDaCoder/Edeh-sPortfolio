import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { PERSONAL } from "../../../data/portfolio";

export const useProfileKey = {
  all: ["profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: useProfileKey.all,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/profile");
        const p = data.data;
        if (!p) return { ...PERSONAL };
        return {
          ...PERSONAL,
          name:
            [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ") ||
            PERSONAL.name,
          alias: p.alias ?? PERSONAL.alias,
          tagline: p.tagline ?? PERSONAL.tagline,
          subTagline: p.subTagline ?? PERSONAL.subTagline,
          fullHeadline: p.fullHeadline ?? PERSONAL.fullHeadline,
          bio: [p.bio1 ?? PERSONAL.bio[0], p.bio2 ?? PERSONAL.bio[1]] as const,
          pullQuote: p.pullQuote ?? PERSONAL.pullQuote,
          availability: p.availability ?? PERSONAL.availability,
          email: p.email ?? PERSONAL.email,
          phone: p.phone ?? PERSONAL.phone,
          location: p.location ?? PERSONAL.location,
          locationShort: p.locationShort ?? PERSONAL.locationShort,
          github: p.github ?? PERSONAL.github,
          linkedin: p.linkedin ?? PERSONAL.linkedin,
          youtube: p.youtube ?? PERSONAL.youtube,
          twitter: p.twitter ?? PERSONAL.twitter,
          portfolio: p.portfolio ?? PERSONAL.portfolio,
          calendly: p.calendly ?? PERSONAL.calendly,
          languages: PERSONAL.languages,
        };
      } catch {
        return { ...PERSONAL };
      }
    },
    placeholderData: { ...PERSONAL },
    retry: 1,
  });
}
