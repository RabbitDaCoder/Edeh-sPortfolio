import type { HTMLAttributes, ReactNode } from "react";
type BadgeVariant = "default" | "muted" | "outline" | "pulse";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    children: ReactNode;
}
export declare function Badge({ variant, className, children, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Badge.d.ts.map