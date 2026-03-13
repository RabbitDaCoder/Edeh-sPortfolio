import React from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { Code2, Box, Cpu, MessageSquare } from "lucide-react";
import { PERSONAL, SERVICES } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Code2,
  Box,
  Cpu,
  MessageSquare,
};

export const AboutSection: React.FC = () => {
  const { data: personal = PERSONAL } = useProfile();

  return (
    <Section id="about" className="bg-surface/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Text */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-display-lg font-serif text-text-primary leading-[1.1]"
          >
            Engineer.
            <br />
            Creator.
            <br />
            <span className="text-text-muted">Builder.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 text-text-muted leading-relaxed"
          >
            <p>{personal.bio[0]}</p>
            <p>{personal.bio[1]}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-accent pl-6 py-4">
              <blockquote className="italic text-text-primary">
                &ldquo;{personal.pullQuote}&rdquo;
              </blockquote>
            </Card>
          </motion.div>
        </div>

        {/* Right: Stats / highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: "4+", label: "Years of experience" },
            { value: "20+", label: "Projects delivered" },
            { value: "5+", label: "Technologies mastered" },
            { value: "100%", label: "Passion for craft" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center space-y-2">
              <span className="text-display-md font-serif text-text-primary">
                {stat.value}
              </span>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Services grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16"
      >
        {SERVICES.map((service) => {
          const Icon = ICON_MAP[service.icon];
          return (
            <Card key={service.id} hover="scale" className="p-6 space-y-3">
              {Icon && <Icon className="w-5 h-5 text-text-muted" />}
              <h3 className="text-base font-semibold text-text-primary">
                {service.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {service.description}
              </p>
            </Card>
          );
        })}
      </motion.div>
    </Section>
  );
};
