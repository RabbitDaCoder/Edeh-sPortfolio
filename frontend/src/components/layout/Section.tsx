import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSceneStore, SectionId } from "../../store/sceneStore";

export interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const SCENE_IDS = new Set<string>([
  "hero",
  "about",
  "skills",
  "work",
  "career",
  "achievements",
  "blog",
  "books",
  "call",
  "cv",
  "contact",
]);

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  containerClassName,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveSection = useSceneStore((s) => s.setActiveSection);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !SCENE_IDS.has(id)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id as SectionId);
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative z-[1] w-full py-10 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 ${
        className || ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`max-w-6xl mx-auto ${containerClassName || ""}`}
      >
        {children}
      </motion.div>
    </section>
  );
};
