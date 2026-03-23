import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, Children, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../utils/cn";
const slideWidths = {
    1: "flex-[0_0_100%]",
    2: "flex-[0_0_50%]",
    3: "flex-[0_0_33.333%]",
};
export function Carousel({ slides, children, slidesToShow = 1, gap = 16, autoPlay = false, autoplay = false, autoplayInterval = 5000, showControls = true, className, }) {
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
        if (!emblaApi)
            return;
        setSelected(emblaApi.selectedScrollSnap());
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi)
            return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);
    useEffect(() => {
        if (!shouldAutoPlay || !emblaApi)
            return;
        const id = setInterval(() => emblaApi.scrollNext(), autoplayInterval);
        return () => clearInterval(id);
    }, [shouldAutoPlay, autoplayInterval, emblaApi]);
    return (_jsxs("div", { className: cn("relative", className), children: [_jsx("div", { className: "overflow-hidden", ref: emblaRef, children: _jsx("div", { className: "flex", style: { gap }, children: items.map((slide, i) => (_jsx("div", { className: slideWidths[slidesToShow] ?? "flex-[0_0_100%]", children: slide }, i))) }) }), showControls && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => emblaApi?.scrollPrev(), disabled: !canPrev, className: "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 rounded-full bg-background border border-border text-text-primary hover:bg-surface disabled:opacity-30 transition-colors z-10", "aria-label": "Previous", children: _jsx(ChevronLeft, { size: 18, strokeWidth: 1.5 }) }), _jsx("button", { onClick: () => emblaApi?.scrollNext(), disabled: !canNext, className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 rounded-full bg-background border border-border text-text-primary hover:bg-surface disabled:opacity-30 transition-colors z-10", "aria-label": "Next", children: _jsx(ChevronRight, { size: 18, strokeWidth: 1.5 }) })] })), _jsx("div", { className: "flex justify-center gap-2 mt-6", children: items.map((_, i) => (_jsx("button", { onClick: () => emblaApi?.scrollTo(i), className: cn("h-1.5 rounded-pill transition-all duration-300", i === selected
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-border hover:bg-text-muted"), "aria-label": `Go to slide ${i + 1}` }, i))) })] }));
}
//# sourceMappingURL=Carousel.js.map