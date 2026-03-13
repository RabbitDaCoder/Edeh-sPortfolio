import {
  forwardRef,
  useRef,
  useEffect,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { createMagneticEffect } from "../../lib/gsap";

type ButtonVariant = "primary" | "ghost" | "outline" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:opacity-80 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text-primary border border-transparent hover:bg-surface",
  outline:
    "bg-transparent text-text-primary border border-border hover:border-text-primary",
  icon: "bg-transparent text-text-primary border border-transparent hover:bg-surface aspect-square",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-body-sm",
  md: "px-6 py-3 text-body-md",
  lg: "px-8 py-4 text-body-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      magnetic = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const magneticRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (!magnetic || !magneticRef.current) return;
      return createMagneticEffect(magneticRef.current);
    }, [magnetic]);

    return (
      <button
        ref={(node) => {
          magneticRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-body font-medium rounded-md",
          "transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-accent",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variants[variant],
          variant !== "icon" && sizes[size],
          variant === "icon" &&
            (size === "sm" ? "p-2" : size === "lg" ? "p-4" : "p-3"),
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
