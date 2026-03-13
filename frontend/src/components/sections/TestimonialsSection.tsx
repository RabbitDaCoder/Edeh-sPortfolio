import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { TESTIMONIALS } from "../../data/portfolio";
import { useTestimonials } from "../../features/testimonials/hooks/useTestimonials";

gsap.registerPlugin(ScrollTrigger);

function TestimonialCard({
  name,
  role,
  company,
  quote,
}: {
  name: string;
  role: string;
  company: string;
  quote: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <Card className="p-6 space-y-4 h-full flex flex-col">
      <p className="text-text-muted text-sm leading-relaxed flex-1 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-mono text-text-muted">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <p className="text-xs text-text-muted">
            {role}, {company}
          </p>
        </div>
      </div>
    </Card>
  );
}

function MobileTestimonials({ items }: { items: typeof TESTIMONIALS }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((t) => (
            <div key={t.id} className="min-w-0 flex-[0_0_100%] px-2">
              <TestimonialCard
                name={t.name}
                role={t.role}
                company={t.company}
                quote={t.quote}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === selected ? "bg-accent" : "border border-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const TestimonialsSection: React.FC = () => {
  const { data: testimonials = TESTIMONIALS } = useTestimonials();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".testimonial-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="testimonials">
      <div className="space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-display-lg font-serif text-text-primary"
        >
          What People Say
        </motion.h2>

        {/* Desktop: 3-column grid */}
        <div ref={containerRef} className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <TestimonialCard
                name={t.name}
                role={t.role}
                company={t.company}
                quote={t.quote}
              />
            </div>
          ))}
        </div>

        {/* Mobile: Embla carousel */}
        <div className="md:hidden">
          <MobileTestimonials items={testimonials} />
        </div>
      </div>
    </Section>
  );
};
