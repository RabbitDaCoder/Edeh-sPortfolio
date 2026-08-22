import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export const useProfileKey = {
    all: ["profile"],
};
export function useProfile() {
    return useQuery({
        queryKey: useProfileKey.all,
        queryFn: async () => {
            const { data } = await apiClient.get("/profile");
            const p = data.data;
            if (!p)
                return null;
            return {
                name: [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "),
                alias: p.alias,
                tagline: p.tagline,
                subTagline: p.subTagline,
                fullHeadline: p.fullHeadline,
                bio: [p.bio1, p.bio2].filter(Boolean),
                pullQuote: p.pullQuote,
                availability: p.availability,
                email: p.email,
                phone: p.phone,
                location: p.location,
                locationShort: p.locationShort,
                github: p.github,
                linkedin: p.linkedin,
                youtube: p.youtube,
                twitter: p.twitter,
                portfolio: p.portfolio,
                calendly: p.calendly,
            };
        },
        retry: 1,
    });
}
//# sourceMappingURL=useProfile.js.map