import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useCareerTimeline } from "../../features/career/hooks/useCareer";
import { EXPERIENCES } from "../../data/portfolio";
import type { Experience } from "../../data/portfolio";
import { Briefcase, GraduationCap, Rocket, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type FilterType = "all" | "work" | "education" | "founder" | "blockchain";

const TYPE_MAP: Record<string, Experience["type"]> = {
  JOB: "work",
  FREELANCE: "freelance",
  EDUCATION: "education",
  VOLUNTEER: "volunteer",
  ACHIEVEMENT: "work",
  PLAN: "plan",
  BLOCKCHAIN: "blockchain",
  FOUNDER: "founder",
};

const TYPE_CONFIG: Record<string, { icon: typeof Briefcase; label: string }> = {
  work: { icon: Briefcase, label: "Work" },
  education: { icon: GraduationCap, label: "Education" },
  founder: { icon: Rocket, label: "Founder" },
  freelance: { icon: Briefcase, label: "Freelance" },
  volunteer: { icon: GraduationCap, label: "Volunteer" },
  plan: { icon: Rocket, label: "Plan" },
  blockchain: { icon: Rocket, label: "Blockchain" },
};

/* ── Single timeline card ─────────────────────────────────────────── */

function TimelineCard({ entry, index }: { entry: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;
  const Icon = TYPE_CONFIG[entry.type]?.icon ?? Briefcase;

  return (
    <div
      ref={ref}
      className={`relative flex items-start md:gap-0 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex-1 md:w-[calc(50%-2rem)]"
      >
        <div className="group relative border border-border rounded-lg p-5 sm:p-6 bg-surface/50 backdrop-blur-sm hover:border-text-muted/30 transition-colors duration-300">
          {/* Period chip — top-right corner */}
          <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-text-muted uppercase">
            {entry.date}
          </span>

          {/* Type icon + label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-background">
              <Icon className="w-3.5 h-3.5 text-text-muted" />
            </span>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider"
            >
              {TYPE_CONFIG[entry.type]?.label ?? entry.type}
            </Badge>
          </div>

          {/* Role */}
          <h3 className="text-base sm:text-lg font-semibold text-text-primary leading-tight pr-20">
            {entry.title}
          </h3>

          {/* Organisation */}
          <p className="mt-1 text-sm font-medium text-text-muted flex items-center gap-1">
            <ChevronRight className="w-3 h-3 opacity-50" />
            {entry.organisation}
          </p>

          {/* Description */}
          <p className="mt-3 text-sm text-text-muted/80 leading-relaxed">
            {entry.description}
          </p>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      {/* ── Center dot (visible only md+) ────────────────────── */}
      <div className="hidden md:flex flex-col items-center w-16 shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{
            duration: 0.3,
            delay: 0.1,
            type: "spring",
            stiffness: 300,
          }}
          className="relative w-4 h-4 rounded-full border-2 border-accent bg-background z-10"
        >
          <span className="absolute inset-[3px] rounded-full bg-accent" />
        </motion.div>
      </div>

      {/* ── Empty spacer for alternating layout (md+) ────────── */}
      <div className="hidden md:block flex-1 md:w-[calc(50%-2rem)]" />

      {/* ── Mobile dot (sm only) ─────────────────────────────── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="absolute -left-2 top-6 w-3 h-3 rounded-full border-2 border-accent bg-background md:hidden z-10"
      >
        <span className="absolute inset-[2px] rounded-full bg-accent" />
      </motion.div>
    </div>
  );
}

/* ── Career section ───────────────────────────────────────────────── */

function formatPeriod(start: string, end?: string, current?: boolean): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return current || !end
    ? `${fmt(start)} — Present`
    : `${fmt(start)} — ${fmt(end)}`;
}

export const CareerSection: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const progressLineRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { data: raw } = useCareerTimeline();

  const experiences: Experience[] = (raw ?? []).length
    ? (raw ?? []).map((e: any) => ({
        id: e.id,
        type: TYPE_MAP[e.type] ?? "work",
        title: e.title ?? "",
        organisation: e.organisation ?? "",
        description: e.description ?? "",
        date: e.date ?? formatPeriod(e.startDate, e.endDate, e.current),
        startDate: e.startDate ?? "",
        endDate: e.endDate ?? null,
        current: e.current ?? false,
        points: e.points ?? [],
        keySkills: e.keySkills ?? [],
        order: e.order ?? 0,
      }))
    : EXPERIENCES;

  const filtered = experiences.filter(
    (entry) => filter === "all" || entry.type === filter,
  );

  // Scroll-driven progress line
  useEffect(() => {
    if (!progressLineRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.3,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [filtered]);

  if (experiences.length === 0) return null;

  return (
    <Section id="career">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-label text-text-muted uppercase tracking-widest mb-2">
              Experience
            </p>
            <h2 className="text-display-lg font-serif text-text-primary">
              Career Timeline
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2">
            {(
              ["all", "work", "founder", "blockchain", "education"] as const
            ).map((type) => (
              <Button
                key={type}
                variant={filter === type ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(type)}
                className="capitalize text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline container */}
        <div ref={timelineRef} className="relative pl-6 md:pl-0">
          {/* ── Vertical track (mobile: left edge, md: center) ── */}
          <div className="absolute left-1 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border/40" />

          {/* ── Progress fill ────────────────────────────────── */}
          <div
            ref={progressLineRef}
            className="absolute left-1 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-accent origin-top"
            style={{ transformOrigin: "top center" }}
          />

          {/* ── Cards ────────────────────────────────────────── */}
          <div className="space-y-8 md:space-y-12">
            {filtered.map((entry, i) => (
              <TimelineCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
