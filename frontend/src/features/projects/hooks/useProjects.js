import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { PROJECTS } from "../../../data/portfolio";
export const useProjectsKey = {
    all: ["projects"],
    featured: ["projects", "featured"],
};
export function useProjects() {
    return useQuery({
        queryKey: useProjectsKey.all,
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/projects?published=true");
                const items = data.data;
                if (!items?.length)
                    return PROJECTS;
                return items.map((p) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    longDescription: p.longDescription || "",
                    tags: p.tags ?? p.stack ?? [],
                    projectType: p.projectType || "personal",
                    featured: p.featured,
                    liveUrl: p.liveUrl || undefined,
                    githubUrl: p.githubUrl || undefined,
                    typographicMark: p.typographicMark || p.name.charAt(0),
                    order: p.order ?? 0,
                }));
            }
            catch {
                return PROJECTS;
            }
        },
        placeholderData: PROJECTS,
        retry: 1,
    });
}
export function useFeaturedProjects() {
    const { data, ...rest } = useProjects();
    return { data: data?.filter((p) => p.featured) ?? [], ...rest };
}
//# sourceMappingURL=useProjects.js.map