import type { RefObject } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../../../data/portfolio";

export interface ProjectData {
  index: string;
  name: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  typographicMark: string;
}

/** Convert portfolio Project to card-local ProjectData */
export function toProjectData(p: Project): ProjectData {
  return {
    index: p.index,
    name: p.name,
    description: p.description,
    stack: p.stack,
    github: p.githubUrl,
    live: p.liveUrl,
    typographicMark: p.typographicMark,
  };
}

interface ProjectCardProps {
  project: ProjectData;
  cardRef: RefObject<HTMLDivElement>;
  variant: "top" | "peek" | "stack";
  index: number;
}

export function ProjectCard({
  project,
  cardRef,
  variant,
  index,
}: ProjectCardProps) {
  const isTop = variant === "top";
  const isPeek = variant === "peek";

  return (
    <div
      ref={cardRef}
      className={`absolute inset-y-0 ${
        isPeek
          ? "left-[calc(50%+0.5rem)] w-[calc(50%-0.5rem)]"
          : "left-0 w-[calc(50%-0.5rem)]"
      } bg-surface border border-border rounded-lg overflow-hidden`}
      style={{ transformOrigin: "bottom left" }}
    >
      <div className="flex h-full">
        {/* Left column — details */}
        <div className="w-[45%] p-6 md:p-8 flex flex-col justify-center">
          <span className="font-serif text-display-xl text-text-muted leading-none select-none">
            {project.index}
          </span>
          <h3
            className={`font-serif text-display-lg mt-4 leading-tight ${
              isPeek ? "line-clamp-1" : ""
            }`}
          >
            {project.name}
          </h3>
          {!isPeek && (
            <p className="text-body-md text-text-muted mt-3 leading-relaxed line-clamp-3">
              {project.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {(isPeek ? project.stack.slice(0, 3) : project.stack).map(
              (tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ),
            )}
          </div>
          {!isPeek && (
            <div className="mt-6 flex gap-3">
              {project.github && (
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => window.open(project.github, "_blank")}
                  aria-label={`${project.name} on GitHub`}
                >
                  <Github size={16} strokeWidth={1.5} />
                </Button>
              )}
              {project.live && (
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => window.open(project.live, "_blank")}
                  aria-label={`${project.name} live site`}
                >
                  <ExternalLink size={16} strokeWidth={1.5} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right column — visual mark */}
        <div className="relative w-[55%] flex items-center justify-center overflow-hidden h-full">
          {/* Corner accents */}
          <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-border opacity-50" />
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-border opacity-50" />
          {/* Centre rule */}
          <span className="absolute left-0 top-1/2 w-full h-px bg-border opacity-40" />
          {/* Typographic mark */}
          <span
            className={`font-serif text-[12rem] leading-none text-text-primary ${
              isPeek ? "opacity-[0.04]" : "opacity-[0.06]"
            } select-none pointer-events-none absolute -right-8 rotate-[-12deg]`}
          >
            {project.typographicMark}
          </span>
          {/* Peek fade overlay */}
          {isPeek && (
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/60 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile card (full-width, single column) ─────── */
export function MobileProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="min-w-0 flex-[0_0_100%] px-2">
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {/* Visual mark area */}
        <div className="relative h-40 flex items-center justify-center overflow-hidden">
          <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-border opacity-50" />
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-border opacity-50" />
          <span className="absolute left-0 top-1/2 w-full h-px bg-border opacity-40" />
          <span className="font-serif text-[8rem] leading-none text-text-primary opacity-[0.05] select-none pointer-events-none rotate-[-12deg]">
            {project.typographicMark}
          </span>
        </div>
        {/* Details */}
        <div className="p-6 space-y-3">
          <span className="font-serif text-display-md text-text-muted leading-none select-none">
            {project.index}
          </span>
          <h3 className="font-serif text-display-lg leading-tight">
            {project.name}
          </h3>
          <p className="text-body-md text-text-muted leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3 pt-3 border-t border-border">
            {project.github && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => window.open(project.github, "_blank")}
                aria-label={`${project.name} on GitHub`}
              >
                <Github size={16} strokeWidth={1.5} />
              </Button>
            )}
            {project.live && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => window.open(project.live, "_blank")}
                aria-label={`${project.name} live site`}
              >
                <ExternalLink size={16} strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
