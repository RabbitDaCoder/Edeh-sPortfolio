import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { TESTIMONIALS } from "../../../data/portfolio";
import type { Testimonial } from "../../../data/portfolio";

export const useTestimonialsKey = {
  all: ["testimonials"] as const,
};

export function useTestimonials() {
  return useQuery({
    queryKey: useTestimonialsKey.all,
    queryFn: async (): Promise<Testimonial[]> => {
      try {
        const { data } = await apiClient.get("/testimonials?published=true");
        const items = data.data;
        if (!items?.length) return TESTIMONIALS;
        return items.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          quote: t.quote,
        }));
      } catch {
        return TESTIMONIALS;
      }
    },
    placeholderData: TESTIMONIALS,
    retry: 1,
  });
}
