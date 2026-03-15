import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { PolaroidCarousel } from "../ui/PolaroidCarousel";
import { PERSONAL } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";

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
      <div className="w-full max-w-3xl overflow-hidden">
        {/* Text content */}
        <div className="space-y-8">
          <Badge variant="pulse" className="text-xs">
            {personal.availability}
          </Badge>

          <h1
            ref={headlineRef}
            className="text-display-2xl font-serif text-text-primary leading-[0.9] tracking-tight break-words"
          >
            {personal.name.split(" ").map((part, i, arr) => (
              <span
                key={part}
                className={`hero-line block ${
                  i === arr.length - 1 ? "text-text-muted" : ""
                }`}
              >
                {part}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-body-lg text-text-muted max-w-lg"
          >
            {personal.tagline}
          </motion.p>
        </div>
      </div>

      {/* Polaroid strip — sits below the hero text + 3D area */}
      <div
        className="w-full mt-12 md:mt-16 overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      >
        <PolaroidCarousel />
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
