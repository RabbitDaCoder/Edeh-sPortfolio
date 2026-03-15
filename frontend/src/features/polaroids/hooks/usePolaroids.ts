import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { POLAROIDS } from "../../../data/portfolio";
import type { Polaroid } from "../../../data/portfolio";

export const usePolaroidsKey = {
  all: ["polaroids"] as const,
};

export function usePolaroids() {
  return useQuery({
    queryKey: usePolaroidsKey.all,
    queryFn: async (): Promise<Polaroid[]> => {
      try {
        const { data } = await apiClient.get("/polaroids?published=true");
        const items = data.data;
        if (!items?.length) return POLAROIDS;
        return items.map((p: any) => ({
          id: p.id,
          src: p.src || "",
          alt: p.alt,
          caption: p.caption,
          rotation: p.rotation ?? 0,
        }));
      } catch {
        return POLAROIDS;
      }
    },
    placeholderData: POLAROIDS,
    retry: 1,
  });
}
