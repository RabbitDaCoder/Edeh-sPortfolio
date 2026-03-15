import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "../layout/Section";
import { Badge } from "../ui/Badge";
import { useAchievements } from "../../features/achievements/hooks/useAchievements";
import { ACHIEVEMENTS as FALLBACK_ACHIEVEMENTS } from "../../data/portfolio";
import type { Achievement } from "../../data/portfolio";
import { Award, Trophy, Zap, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Trophy, Zap, Award, BookOpen];

/* ── Single achievement milestone ─────────────────────────────────── */

function AchievementMilestone({
  achievement,
  index,
  total,
}: {
  achievement: Achievement;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = ICONS[index % ICONS.length];
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start md:gap-0 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30, y: 10 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex-1 md:w-[calc(50%-2rem)]"
      >
        <div className="group relative border border-border rounded-lg p-5 sm:p-6 bg-surface/50 backdrop-blur-sm hover:border-text-muted/30 transition-colors duration-300 overflow-hidden">
          {/* Large faded step number watermark */}
          <span className="absolute -top-4 -right-2 text-[80px] font-serif font-bold text-text-primary/[0.03] leading-none select-none pointer-events-none">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Top row: icon + year */}
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background">
              <Icon className="w-4 h-4 text-text-muted" />
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono tracking-wider"
            >
              {achievement.date}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-text-primary leading-tight">
            {achievement.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-text-muted/80 leading-relaxed">
            {achievement.description}
          </p>

          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      {/* ── Center milestone dot (md+) ───────────────────────── */}
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

      {/* ── Empty spacer (md+ alternating) ───────────────────── */}
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

/* ── Achievements section ─────────────────────────────────────────── */

function formatDate(d?: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export const AchievementsSection: React.FC = () => {
  const progressLineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: raw } = useAchievements();

  const achievements: Achievement[] = (raw ?? []).length
    ? (raw ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description ?? "",
        date: a.date ?? "",
        order: a.order ?? 0,
      }))
    : FALLBACK_ACHIEVEMENTS;

  // Scroll-driven progress line
  useEffect(() => {
    if (!progressLineRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.3,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  if (achievements.length === 0) return null;

  return (
    <Section id="achievements" className="bg-surface/30">
      <div className="space-y-12">
        {/* Header */}
        <div>
          <p className="text-label text-text-muted uppercase tracking-widest mb-2">
            Milestones
          </p>
          <h2 className="text-display-lg font-serif text-text-primary">
            Achievements
          </h2>
        </div>

        {/* Timeline track */}
        <div ref={trackRef} className="relative pl-6 md:pl-0">
          {/* ── Vertical track line ─────────────────────────── */}
          <div className="absolute left-1 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border/40" />

          {/* ── Progress fill ────────────────────────────────── */}
          <div
            ref={progressLineRef}
            className="absolute left-1 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-accent origin-top"
            style={{ transformOrigin: "top center" }}
          />

          {/* ── Milestones ───────────────────────────────────── */}
          <div className="space-y-8 md:space-y-12">
            {achievements.map((achievement, i) => (
              <AchievementMilestone
                key={achievement.id}
                achievement={achievement}
                index={i}
                total={achievements.length}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
