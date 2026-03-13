import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { PERSONAL } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";

/** Pure CSS orbital rings — visual anchor for 3D sphere area */
const OrbitalRings: React.FC = () => (
  <div className="relative w-full aspect-square max-w-md mx-auto">
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border border-border/30 animate-[spin_30s_linear_infinite]" />
    {/* Mid ring */}
    <div className="absolute inset-[12%] rounded-full border border-border/20 animate-[spin_22s_linear_infinite_reverse]" />
    {/* Inner ring */}
    <div className="absolute inset-[24%] rounded-full border border-border/15 animate-[spin_16s_linear_infinite]" />
    {/* Center dot */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-text-muted/30" />
    {/* Orbital nodes */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-text-muted/50" />
    <div className="absolute bottom-[12%] right-[5%] w-1 h-1 rounded-full bg-text-muted/40" />
    <div className="absolute top-[30%] left-[5%] w-1 h-1 rounded-full bg-text-muted/30" />
  </div>
);

export const HeroSection: React.FC = () => {
  const { data: personal = PERSONAL } = useProfile();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const lines = headlineRef.current.querySelectorAll(".hero-line");
    lines.forEach((line, i) => {
      const el = line as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(60px)";
      setTimeout(
        () => {
          el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        300 + i * 150,
      );
    });
  }, []);

  return (
    <Section id="hero" className="min-h-screen flex items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left column — text */}
        <div className="space-y-8">
          <Badge variant="pulse" className="text-xs">
            {personal.availability}
          </Badge>

          <h1
            ref={headlineRef}
            className="text-display-2xl font-serif text-text-primary leading-[0.9] tracking-tight"
          >
            <span className="hero-line block">{personal.name.first}</span>
            <span className="hero-line block">{personal.name.middle}</span>
            <span className="hero-line block text-text-muted">
              {personal.name.last}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-body-lg text-text-muted max-w-lg"
          >
            {personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              magnetic
              onClick={() =>
                document
                  .querySelector("#call")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get in touch
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .querySelector("#work")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View work
            </Button>
          </motion.div>
        </div>

        {/* Right column — orbital rings (3D sphere renders through GlobalCanvas) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:block"
        >
          <OrbitalRings />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() =>
          document
            .querySelector("#about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <div className="w-6 h-10 border border-text-muted rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-text-muted rounded-full" />
        </div>
      </motion.div>
    </Section>
  );
};
