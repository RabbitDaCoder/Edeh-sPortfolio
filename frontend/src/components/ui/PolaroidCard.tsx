import { motion } from "framer-motion";
import type { Polaroid } from "../../data/portfolio";

type Props = {
  polaroid: Polaroid;
  index: number;
};

export function PolaroidCard({ polaroid, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: polaroid.rotation }}
      animate={{ opacity: 1, y: 0, rotate: polaroid.rotation }}
      transition={{
        duration: 0.55,
        delay: 0.15 + index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -10,
        rotate: polaroid.rotation * 0.3,
        scale: 1.04,
        zIndex: 10,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      style={{
        transformOrigin: "center bottom",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      {/* Polaroid frame */}
      <div
        className="bg-[#F5F5F0] dark:bg-[#E8E8E2] shadow-[0_4px_24px_rgba(0,0,0,0.35)] w-[110px] sm:w-[clamp(130px,28vw,160px)]"
        style={{
          padding: "10px 10px 40px 10px",
          borderRadius: "2px",
        }}
      >
        {/* Photo area */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            backgroundColor: "#1A1A1A",
            position: "relative",
          }}
        >
          {polaroid.src ? (
            <img
              src={polaroid.src}
              alt={polaroid.alt}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "grayscale(100%) contrast(1.05)",
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLImageElement).style.filter =
                  "grayscale(0%) contrast(1.0)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLImageElement).style.filter =
                  "grayscale(100%) contrast(1.05)";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Caption — handwritten style */}
        <p
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: "13px",
            color: "#2C2C2C",
            textAlign: "center",
            marginTop: "8px",
            marginBottom: 0,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
          }}
        >
          {polaroid.caption}
        </p>
      </div>
    </motion.div>
  );
}
