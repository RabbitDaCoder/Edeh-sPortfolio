import { useRef } from "react";
import { PolaroidCard } from "./PolaroidCard";
import { usePolaroids } from "../../features/polaroids/hooks/usePolaroids";

export function PolaroidCarousel() {
  const { data: polaroids = [] } = usePolaroids();
  const trackRef = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const onMouseLeave = () => {
    isDown = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  };

  const onMouseUp = () => {
    isDown = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5;
    if (trackRef.current) {
      trackRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="w-full overflow-hidden pb-6 pt-4">
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="polaroid-track flex flex-row items-end gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-6 sm:justify-center"
        style={{
          scrollbarWidth: "none",
          cursor: "grab",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {polaroids.map((polaroid, i) => (
          <div
            key={polaroid.id}
            className="snap-center"
            style={{ flexShrink: 0 }}
          >
            <PolaroidCard polaroid={polaroid} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
