import React from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { useProfile } from "../../features/profile/hooks/useProfile";

export const AboutSection: React.FC = () => {
  const { data: personal } = useProfile();

  if (!personal) return null;

  const bio = personal.bio;
  const pullQuote = personal.pullQuote;

  return (
    <Section id="about" className="bg-surface/30">
      <div className="grid grid-cols-1 gap-12 items-start">
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
            <p>{bio[0]}</p>
            <p>{bio[1]}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-accent pl-6 py-4">
              <blockquote className="italic text-text-primary">
                &ldquo;{pullQuote}&rdquo;
              </blockquote>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
