import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type BadgeVariant = "default" | "muted" | "outline" | "pulse";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-accent text-background",
  muted: "bg-surface text-text-muted",
  outline: "border border-border text-text-muted bg-transparent",
  pulse: "bg-surface text-text-muted",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-pill text-label uppercase tracking-widest font-body font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {variant === "pulse" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
      )}
      {children}
    </span>
  );
}
