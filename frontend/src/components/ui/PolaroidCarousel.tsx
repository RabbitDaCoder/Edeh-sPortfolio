import { PolaroidCard } from "./PolaroidCard";
import { usePolaroids } from "../../features/polaroids/hooks/usePolaroids";

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
export function PolaroidCarousel() {
  const { data: polaroids = [] } = usePolaroids();

  if (polaroids.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...polaroids, ...polaroids];

  // Speed: more cards → longer duration so each card is visible long enough
  const duration = 20 + polaroids.length * 4;

  return (
    <div
      style={{
        width: "100%",
        paddingBottom: "2rem",
        paddingTop: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(12px, 3vw, 24px)",
          width: "max-content",
          animation: `polaroid-scroll ${duration}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "running";
        }}
      >
        {doubled.map((polaroid, i) => (
          <div key={`${polaroid.id}-${i}`} style={{ flexShrink: 0 }}>
            <PolaroidCard polaroid={polaroid} index={i % polaroids.length} />
          </div>
        ))}
      </div>
    </div>
  );
}
