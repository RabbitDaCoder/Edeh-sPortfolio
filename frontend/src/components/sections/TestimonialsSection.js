import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { TESTIMONIALS } from "../../data/portfolio";
import { useTestimonials } from "../../features/testimonials/hooks/useTestimonials";
gsap.registerPlugin(ScrollTrigger);
function TestimonialCard({ name, designation, company, quote, initials, }) {
    return (_jsxs(Card, { className: "p-6 space-y-4 h-full flex flex-col", children: [_jsxs("p", { className: "text-text-muted text-sm leading-relaxed flex-1 italic", children: ["\u201C", quote, "\u201D"] }), _jsxs("div", { className: "flex items-center gap-3 pt-2 border-t border-border", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-mono text-text-muted", children: initials }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-text-primary", children: name }), _jsxs("p", { className: "text-xs text-text-muted", children: [designation, ", ", company] })] })] })] }));
}
function MobileTestimonials({ items }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selected, setSelected] = useState(0);
    useEffect(() => {
        if (!emblaApi)
            return;
        const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);
    return (_jsxs("div", { children: [_jsx("div", { ref: emblaRef, className: "overflow-hidden", children: _jsx("div", { className: "flex", children: items.map((t) => (_jsx("div", { className: "min-w-0 flex-[0_0_100%] px-2", children: _jsx(TestimonialCard, { name: t.name, designation: t.designation, company: t.company, quote: t.quote, initials: t.initials }) }, t.id))) }) }), _jsx("div", { className: "flex justify-center gap-2 mt-4", children: items.map((_, i) => (_jsx("span", { className: `w-2 h-2 rounded-full transition-colors ${i === selected ? "bg-accent" : "border border-border"}` }, i))) })] }));
}
export const TestimonialsSection = () => {
    const { data: testimonials = TESTIMONIALS } = useTestimonials();
    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current)
            return;
        const cards = containerRef.current.querySelectorAll(".testimonial-card");
        if (!cards.length)
            return;
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
    return (_jsx(Section, { id: "testimonials", children: _jsxs("div", { className: "space-y-12", children: [_jsx(motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-display-lg font-serif text-text-primary", children: "What People Say" }), _jsx("div", { ref: containerRef, className: "hidden md:grid md:grid-cols-3 gap-6", children: testimonials.map((t) => (_jsx("div", { className: "testimonial-card", children: _jsx(TestimonialCard, { name: t.name, designation: t.designation, company: t.company, quote: t.quote, initials: t.initials }) }, t.id))) }), _jsx("div", { className: "md:hidden", children: _jsx(MobileTestimonials, { items: testimonials }) })] }) }));
};
//# sourceMappingURL=TestimonialsSection.js.map