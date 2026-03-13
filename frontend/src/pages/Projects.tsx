import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { ProjectGridCard } from "../components/projects/ProjectGridCard";
import { PROJECTS } from "../data/portfolio";
import { useProjects } from "../features/projects/hooks/useProjects";

export const ProjectsPage: React.FC = () => {
  const { data: allProjects = PROJECTS } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") ?? "all";

  const allTags = useMemo(
    () => Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort(),
    [allProjects],
  );

  const filtered = useMemo(() => {
    if (activeFilter === "all") return allProjects;
    return allProjects.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter, allProjects]);

  const setFilter = (tag: string) => {
    if (tag === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ filter: tag });
    }
  };

  return (
    <PageWrapper
      title="Projects | Edeh Chinedu Daniel"
      description="Browse all projects — full-stack apps, creative experiments, and open-source tools."
    >
      <Section id="projects">
        <div className="space-y-12">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-display-xl font-serif text-text-primary mb-4">
              All Projects
            </h1>
            <p className="text-body-lg text-text-muted">
              A collection of things I&apos;ve built — from production platforms
              to creative experiments.
            </p>
          </div>

          {/* Filter tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={activeFilter === tag ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProjectGridCard project={project} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-text-muted py-12">
              No projects match this filter.
            </p>
          )}
        </div>
      </Section>
    </PageWrapper>
  );
};
