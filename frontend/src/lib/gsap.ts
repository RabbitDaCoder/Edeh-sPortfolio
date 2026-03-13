import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({ markers: false });

export function createScrollReveal(
  element: Element,
  vars?: gsap.TweenVars,
): gsap.core.Tween {
  return gsap.from(element, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: { trigger: element, start: "top 80%" },
    ...vars,
  });
}

export function createSplitReveal(element: Element): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: element, start: "top 80%" },
  });
  tl.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
  });
  return tl;
}

export function createMagneticEffect(element: HTMLElement): () => void {
  const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power2.out" });
  const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power2.out" });

  const handleMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      xTo(dx * 0.3);
      yTo(dy * 0.3);
    }
  };

  const handleLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  };

  element.addEventListener("mousemove", handleMove);
  element.addEventListener("mouseleave", handleLeave);

  return () => {
    element.removeEventListener("mousemove", handleMove);
    element.removeEventListener("mouseleave", handleLeave);
  };
}

export { gsap, ScrollTrigger };
