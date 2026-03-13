import {
  useEffect,
  useState,
  useCallback,
  Children,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../utils/cn";

interface CarouselProps {
  slides?: ReactNode[];
  children?: ReactNode;
  slidesToShow?: 1 | 2 | 3;
  gap?: number;
  autoPlay?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  showControls?: boolean;
  className?: string;
}

const slideWidths: Record<number, string> = {
  1: "flex-[0_0_100%]",
  2: "flex-[0_0_50%]",
  3: "flex-[0_0_33.333%]",
};

export function Carousel({
  slides,
  children,
  slidesToShow = 1,
  gap = 16,
  autoPlay = false,
  autoplay = false,
  autoplayInterval = 5000,
  showControls = true,
  className,
}: CarouselProps) {
  const items = slides ?? Children.toArray(children);
  const shouldAutoPlay = autoPlay || autoplay;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "start",
  });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!shouldAutoPlay || !emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), autoplayInterval);
    return () => clearInterval(id);
  }, [shouldAutoPlay, autoplayInterval, emblaApi]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" style={{ gap }}>
          {items.map((slide, i) => (
            <div
              key={i}
              className={slideWidths[slidesToShow] ?? "flex-[0_0_100%]"}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 rounded-full bg-background border border-border text-text-primary hover:bg-surface disabled:opacity-30 transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 rounded-full bg-background border border-border text-text-primary hover:bg-surface disabled:opacity-30 transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-pill transition-all duration-300",
              i === selected
                ? "w-6 bg-accent"
                : "w-1.5 bg-border hover:bg-text-muted",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
