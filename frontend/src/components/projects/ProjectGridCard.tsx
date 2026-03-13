import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../../data/portfolio";

interface ProjectCardProps {
  project: Project;
}

export const ProjectGridCard: React.FC<ProjectCardProps> = ({ project }) => {
  const hasLinks = project.liveUrl || project.githubUrl;

  return (
    <Card hover="scale" className="p-6 space-y-4 h-full flex flex-col">
      {/* Header: index + mark */}
      <div className="flex items-start justify-between">
        <span className="font-serif text-display-md text-text-muted leading-none select-none">
          {project.index}
        </span>
        <span className="font-serif text-3xl text-text-muted/10 select-none pointer-events-none">
          {project.typographicMark}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-display-sm text-text-primary leading-tight">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-muted leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Links or Coming Soon */}
      <div className="flex gap-3 pt-3 border-t border-border">
        {hasLinks ? (
          <>
            {project.githubUrl && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => window.open(project.githubUrl, "_blank")}
                aria-label={`${project.name} on GitHub`}
              >
                <Github size={16} strokeWidth={1.5} />
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => window.open(project.liveUrl, "_blank")}
                aria-label={`${project.name} live site`}
              >
                <ExternalLink size={16} strokeWidth={1.5} />
              </Button>
            )}
          </>
        ) : (
          <Badge variant="muted" className="text-xs">
            Coming Soon
          </Badge>
        )}
      </div>
    </Card>
  );
};
