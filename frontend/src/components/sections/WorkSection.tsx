import { useRef, useEffect, useState, createRef, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { MousePointer, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useSceneStore } from "../../store/sceneStore";
import {
  ProjectCard,
  MobileProjectCard,
  toProjectData,
  type ProjectData,
} from "./work/ProjectCard";
import { PROJECTS, PERSONAL } from "../../data/portfolio";
import { useFeaturedProjects } from "../../features/projects/hooks/useProjects";
import { useProfile } from "../../features/profile/hooks/useProfile";

gsap.registerPlugin(ScrollTrigger);

/** Static fallback for initial render */
const fallbackProjects: ProjectData[] = PROJECTS.filter((p) => p.featured).map(
  toProjectData,
);

/* ═══════════════════════════════════════════════════
   MOBILE CAROUSEL
   ═══════════════════════════════════════════════════ */

function MobileWork({
  activeCard,
  projects,
}: {
  activeCard: number;
  projects: ProjectData[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const setActiveProjectIndex = useSceneStore((s) => s.setActiveProjectIndex);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      setSelected(idx);
      setActiveProjectIndex(idx);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, setActiveProjectIndex]);

  return (
    <section
      id="work"
      className="relative w-full py-10 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-surface/30"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <span className="font-mono text-label text-text-muted uppercase tracking-widest">
            03 — Work
          </span>
          <h2 className="font-serif text-display-xl mt-2">Selected Work</h2>
        </div>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {projects.map((p) => (
              <MobileProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2">
          {projects.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === selected ? "bg-accent" : "border border-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   DESKTOP DECK (GSAP pinned)
   ═══════════════════════════════════════════════════ */

export const WorkSection: React.FC = () => {
  const { data: featuredRaw = [] } = useFeaturedProjects();
  const { data: personal = PERSONAL } = useProfile();
  const projects = featuredRaw.length
    ? featuredRaw.map(toProjectData)
    : fallbackProjects;

  const count = projects.length;

  // Dynamic refs for N cards
  const cardRefs = useMemo(
    () => Array.from({ length: count }, () => createRef<HTMLDivElement>()),
    [count],
  );

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [activeCard, setActiveCard] = useState(0);

  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const setActiveProjectIndex = useSceneStore((s) => s.setActiveProjectIndex);
  const setActiveSection = useSceneStore((s) => s.setActiveSection);

  // Sync 3D scene
  useEffect(() => {
    setActiveProjectIndex(activeCard);
  }, [activeCard, setActiveProjectIndex]);

  // Scene activation via IntersectionObserver (replaces Section wrapper)
  useEffect(() => {
    const el = pinWrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveSection("work");
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setActiveSection]);

  // Responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // GSAP deck timeline — dynamic for N cards
  useEffect(() => {
    if (isMobile || count < 2) return;
    if (!pinWrapperRef.current) return;
    // Ensure all refs are attached
    if (cardRefs.some((r) => !r.current)) return;

    const ctx = gsap.context(() => {
      // Header reveal
      ScrollTrigger.create({
        trigger: pinWrapperRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.from(headerRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: "power2.out",
          });
        },
      });

      const transitions = count - 1; // number of peel transitions
      const segmentDuration = 1 / transitions;

      // Pinned deck timeline
      const deckTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: "top top",
          end: `+=${count * 100}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(
              transitions,
              Math.floor(p * transitions + 0.5),
            );
            setActiveCard(idx);
          },
          onLeave: () => {
            gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 });
          },
          onEnterBack: () => {
            gsap.to(ctaRef.current, { opacity: 0, y: 10, duration: 0.2 });
          },
        },
      });

      // Scroll hint fades immediately
      deckTl.to(
        scrollHintRef.current,
        { opacity: 0, y: -10, duration: 0.1 },
        0,
      );

      // Build peel animations for each transition
      for (let t = 0; t < transitions; t++) {
        const startTime = t * segmentDuration;
        const topCard = cardRefs[t].current;
        const nextCard = cardRefs[t + 1].current;

        // Peel top card off to the left
        deckTl.to(
          topCard,
          {
            x: "-110%",
            rotation: -8,
            opacity: 0,
            ease: "power2.inOut",
            duration: segmentDuration,
          },
          startTime,
        );

        // Bring next card to front position
        deckTl.to(
          nextCard,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: "power2.inOut",
            duration: segmentDuration,
          },
          startTime,
        );

        // Pull card behind next one step closer
        const behindCard = cardRefs[t + 2]?.current;
        if (behindCard) {
          deckTl.to(
            behindCard,
            {
              x: 12,
              y: 12,
              scale: 0.97,
              rotation: 1.5,
              opacity: 0.85,
              ease: "power2.inOut",
              duration: segmentDuration,
            },
            startTime,
          );
        }
      }

      // Last card — subtle breathing
      const lastCard = cardRefs[count - 1].current;
      if (lastCard) {
        deckTl.to(
          lastCard,
          { y: -6, duration: 0.17, ease: "sine.inOut", yoyo: true, repeat: 1 },
          1 - 0.25,
        );
      }
    }, pinWrapperRef);

    return () => ctx.revert();
  }, [isMobile, count, cardRefs]);

  if (isMobile)
    return <MobileWork activeCard={activeCard} projects={projects} />;

  // Single featured project — no deck animation needed
  if (count < 2) {
    return (
      <section
        ref={pinWrapperRef}
        id="work"
        className="relative w-full py-10 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16 bg-surface/30"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <span className="font-mono text-label text-text-muted uppercase tracking-widest">
              03 — Work
            </span>
            <h2 className="font-serif text-display-xl mt-2">Selected Work</h2>
          </div>
          {projects[0] && (
            <div className="relative w-full h-[70vh] max-h-[540px]">
              <ProjectCard
                project={projects[0]}
                cardRef={cardRefs[0]}
                variant="top"
                index={0}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  const counter = String(activeCard + 1).padStart(2, "0");

  return (
    <div ref={pinWrapperRef} id="work" className="relative w-full">
      <div className="h-screen w-full flex flex-col justify-center overflow-hidden px-4 md:px-8 lg:px-16">
        {/* Header row */}
        <div ref={headerRef} className="flex items-end justify-between mb-8">
          <div>
            <span className="font-mono text-label text-text-muted uppercase tracking-widest">
              03 — Work
            </span>
            <h2 className="font-serif text-display-xl mt-2">Selected Work</h2>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              key={counter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-label text-text-muted"
            >
              {counter} / {String(projects.length).padStart(2, "0")}
            </motion.span>
            <div className="flex gap-1.5">
              {projects.map((_, i) => (
                <motion.span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= activeCard ? "bg-accent" : "border border-border"
                  }`}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card deck — rendered bottom-to-top (last card at back) */}
        <div className="relative w-full flex-1 flex items-center min-h-0">
          <div className="relative w-full h-[70vh] max-h-[540px]">
            {[...projects].reverse().map((p, reverseIdx) => {
              const i = count - 1 - reverseIdx; // original index
              const getVariant = (): "top" | "peek" | "stack" => {
                if (i === activeCard) return "top";
                if (i === activeCard + 1) return "peek";
                return "stack";
              };
              return (
                <ProjectCard
                  key={`${p.name}-${i}`}
                  project={p}
                  cardRef={cardRefs[i]}
                  variant={getVariant()}
                  index={i}
                />
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
        >
          <motion.div
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              times: [0, 0.2, 0.8, 1],
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="flex flex-col items-center gap-2"
          >
            <MousePointer size={14} strokeWidth={1.5} />
            <span className="font-mono text-label uppercase tracking-widest">
              Scroll to explore
            </span>
          </motion.div>
        </div>

        {/* View all CTA */}
        <div
          ref={ctaRef}
          className="absolute bottom-12 right-4 md:right-8 lg:right-16 opacity-0 translate-y-[10px]"
        >
          <span className="block font-mono text-label text-text-muted uppercase tracking-widest mb-2">
            All projects on GitHub
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(personal.github, "_blank")}
          >
            <ArrowUpRight size={14} strokeWidth={1.5} />
            View GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};
