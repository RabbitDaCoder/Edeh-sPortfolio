import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import type { Testimonial } from "../../../data/portfolio";

export const useTestimonialsKey = {
  all: ["testimonials"] as const,
};

export function useTestimonials() {
  return useQuery({
    queryKey: useTestimonialsKey.all,
    queryFn: async (): Promise<Testimonial[]> => {
      const { data } = await apiClient.get("/testimonials?published=true");
      const items = data.data ?? [];
      return items.map((t: any) => ({
        id: t.id,
        name: t.name,
        designation: t.designation ?? t.role ?? "",
        company: t.company,
        quote: t.quote,
        initials:
          t.initials ??
          t.name
            .split(" ")
            .map((w: string) => w[0])
            .join(""),
      }));
    },
    retry: 1,
  });
}
