import React, { useMemo } from "react";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { useSkills } from "../../features/skills/hooks/useSkills";
import {
  SKILL_CATEGORY_LABELS,
  type SkillCategory,
} from "../../data/portfolio";

export const SkillsSection: React.FC = () => {
  const { data: skills } = useSkills();

  const grouped = useMemo(() => {
    if (!skills?.length) return [];
    const map = new Map<SkillCategory, string[]>();
    for (const tech of skills) {
      const list = map.get(tech.category) ?? [];
      list.push(tech.name);
      map.set(tech.category, list);
    }
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      label: SKILL_CATEGORY_LABELS[category],
      skills: items,
    }));
  }, [skills]);

  if (!grouped.length) return null;

  return (
    <Section id="skills">
      <div className="space-y-12">
        <h2 className="text-display-lg font-serif text-text-primary">
          Skills & Expertise
        </h2>

        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category}>
              <h3 className="text-body-md font-semibold text-text-primary mb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
