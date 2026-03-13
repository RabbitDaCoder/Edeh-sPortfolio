import { useRef, useEffect, useState } from "react";
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
              <MobileProjectCard key={p.index} project={p} />
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

  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

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

  // GSAP deck timeline
  useEffect(() => {
    if (isMobile) return;
    if (
      !pinWrapperRef.current ||
      !card1Ref.current ||
      !card2Ref.current ||
      !card3Ref.current
    )
      return;

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

      // Pinned deck timeline
      const deckTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.33) setActiveCard(0);
            else if (p < 0.66) setActiveCard(1);
            else setActiveCard(2);
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

      // Card 1 peel (0 -> 0.33)
      deckTl.to(
        card1Ref.current,
        {
          x: "-110%",
          rotation: -8,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.33,
        },
        0,
      );
      deckTl.to(
        card2Ref.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.33,
        },
        0,
      );
      deckTl.to(
        card3Ref.current,
        {
          x: 12,
          y: 12,
          scale: 0.97,
          rotation: 1.5,
          opacity: 0.85,
          ease: "power2.inOut",
          duration: 0.33,
        },
        0,
      );

      // Card 2 peel (0.33 -> 0.66)
      deckTl.to(
        card2Ref.current,
        {
          x: "-110%",
          rotation: -8,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.33,
        },
        0.33,
      );
      deckTl.to(
        card3Ref.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.33,
        },
        0.33,
      );

      // Card 3 hold — subtle breathing (0.75 -> 1)
      deckTl.to(
        card3Ref.current,
        { y: -6, duration: 0.17, ease: "sine.inOut", yoyo: true, repeat: 1 },
        0.75,
      );
    }, pinWrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile)
    return <MobileWork activeCard={activeCard} projects={projects} />;

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

        {/* Card deck */}
        <div className="relative w-full flex-1 flex items-center min-h-0">
          <div className="relative w-full h-[70vh] max-h-[540px]">
            <ProjectCard
              project={projects[2]}
              cardRef={card3Ref}
              variant={activeCard < 2 ? "stack" : "top"}
              index={2}
            />
            <ProjectCard
              project={projects[1]}
              cardRef={card2Ref}
              variant={
                activeCard === 0 ? "peek" : activeCard === 1 ? "top" : "stack"
              }
              index={1}
            />
            <ProjectCard
              project={projects[0]}
              cardRef={card1Ref}
              variant={activeCard === 0 ? "top" : "stack"}
              index={0}
            />
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
