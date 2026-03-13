import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md animate-shimmer", className ?? "h-12 w-full")}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--surface) 25%, var(--border) 50%, var(--surface) 75%)",
        backgroundSize: "400px 100%",
      }}
    />
  );
}
