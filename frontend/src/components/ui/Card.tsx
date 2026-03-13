import {
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

type CardVariant = "default" | "lift" | "tilt" | "scale";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: CardVariant;
  children: ReactNode;
}

export function Card({
  variant,
  hover,
  className,
  children,
  ...props
}: CardProps) {
  const v = variant ?? hover ?? "default";
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (v !== "tilt" || !tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  };

  const handleLeave = () => {
    if (v !== "tilt" || !tiltRef.current) return;
    tiltRef.current.style.transform = "";
  };

  if (v === "lift") {
    return (
      <motion.div
        className={cn(
          "bg-surface border border-border rounded-lg overflow-hidden",
          className,
        )}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...(props as object)}
      >
        {children}
      </motion.div>
    );
  }

  if (v === "scale") {
    return (
      <motion.div
        className={cn(
          "bg-surface border border-border rounded-lg overflow-hidden",
          className,
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...(props as object)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={tiltRef}
      className={cn(
        "bg-surface border border-border rounded-lg overflow-hidden",
        v === "tilt" && "transition-transform duration-200",
        className,
      )}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </div>
  );
}
