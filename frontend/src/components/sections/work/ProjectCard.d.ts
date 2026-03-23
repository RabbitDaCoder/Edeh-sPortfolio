import type { RefObject } from "react";
import type { Project } from "../../../data/portfolio";
export interface ProjectData {
    index: string;
    name: string;
    description: string;
    tags: string[];
    github?: string;
    live?: string;
    typographicMark: string;
}
/** Convert portfolio Project to card-local ProjectData */
export declare function toProjectData(p: Project): ProjectData;
interface ProjectCardProps {
    project: ProjectData;
    cardRef: RefObject<HTMLDivElement>;
    variant: "top" | "peek" | "stack";
    index: number;
}
export declare function ProjectCard({ project, cardRef, variant, index, }: ProjectCardProps): import("react/jsx-runtime").JSX.Element;
export declare function MobileProjectCard({ project }: {
    project: ProjectData;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ProjectCard.d.ts.map