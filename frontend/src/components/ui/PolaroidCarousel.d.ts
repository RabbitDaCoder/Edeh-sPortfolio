/**
 * Infinite auto-scrolling polaroid marquee.
 *
 * How it works:
 * - The polaroid array is rendered TWICE side-by-side.
 * - A CSS animation translates the track by -50% (one full set).
 * - When it reaches the end of the first set, it's visually identical
 *   to the start → seamless infinite loop.
 * - Pauses on hover so users can inspect a card.
 * - Speed adapts: 20s base + 4s per card for a relaxed pace.
 */
export declare function PolaroidCarousel(): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PolaroidCarousel.d.ts.map