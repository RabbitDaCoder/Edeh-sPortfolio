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
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        paddingBottom: "1.5rem",
        paddingTop: "1rem",
      }}
    >
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="polaroid-track"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.25rem",
          justifyContent: "center",
          alignItems: "flex-end",
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "grab",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {polaroids.map((polaroid, i) => (
          <div key={polaroid.id} style={{ scrollSnapAlign: "center" }}>
            <PolaroidCard polaroid={polaroid} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
