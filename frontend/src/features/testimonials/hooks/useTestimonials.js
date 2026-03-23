import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { TESTIMONIALS } from "../../../data/portfolio";
export const useTestimonialsKey = {
    all: ["testimonials"],
};
export function useTestimonials() {
    return useQuery({
        queryKey: useTestimonialsKey.all,
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/testimonials?published=true");
                const items = data.data;
                if (!items?.length)
                    return TESTIMONIALS;
                return items.map((t) => ({
                    id: t.id,
                    name: t.name,
                    designation: t.designation ?? t.role ?? "",
                    company: t.company,
                    quote: t.quote,
                    initials: t.initials ??
                        t.name
                            .split(" ")
                            .map((w) => w[0])
                            .join(""),
                }));
            }
            catch {
                return TESTIMONIALS;
            }
        },
        placeholderData: TESTIMONIALS,
        retry: 1,
    });
}
//# sourceMappingURL=useTestimonials.js.map