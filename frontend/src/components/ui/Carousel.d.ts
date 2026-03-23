import { type ReactNode } from "react";
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
export declare function Carousel({ slides, children, slidesToShow, gap, autoPlay, autoplay, autoplayInterval, showControls, className, }: CarouselProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Carousel.d.ts.map