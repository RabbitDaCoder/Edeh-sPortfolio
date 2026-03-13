import { useEffect, useRef } from "react";
import { useSceneStore, SectionId } from "../store/sceneStore";

/**
 * Attach to each Section wrapper. Uses IntersectionObserver to set the
 * active section in the Zustand store when ≥40% of the section is visible.
 */
export function useActivateScene(sectionId: SectionId) {
  const ref = useRef<HTMLElement>(null);
  const setActiveSection = useSceneStore((s) => s.setActiveSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(sectionId);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId, setActiveSection]);

  return ref;
}
