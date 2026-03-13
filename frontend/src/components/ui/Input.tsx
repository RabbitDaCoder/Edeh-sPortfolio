import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, value, defaultValue, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined ? !!value : !!defaultValue;
    const floated = focused || hasValue;

    return (
      <div className="relative flex flex-col">
        {label && (
          <motion.label
            className="absolute left-3 font-body text-text-muted pointer-events-none origin-left"
            animate={{
              y: floated ? -10 : 8,
              scale: floated ? 0.75 : 1,
            }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.label>
        )}
        <input
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full px-3 pt-5 pb-2 font-body text-body-md",
            "border rounded-md bg-transparent text-text-primary placeholder-text-muted",
            "transition-colors duration-200",
            "focus:border-text-primary focus:outline-none",
            error ? "border-2 border-text-primary" : "border-border",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-body-sm text-text-primary font-medium">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-body-sm text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
