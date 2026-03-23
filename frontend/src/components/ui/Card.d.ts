import { type HTMLAttributes, type ReactNode } from "react";
type CardVariant = "default" | "lift" | "tilt" | "scale";
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    hover?: CardVariant;
    children: ReactNode;
}
export declare function Card({ variant, hover, className, children, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Card.d.ts.map