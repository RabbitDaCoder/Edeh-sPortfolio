import { type ButtonHTMLAttributes, type ReactNode } from "react";
type ButtonVariant = "primary" | "ghost" | "outline" | "icon";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    magnetic?: boolean;
    loading?: boolean;
    children: ReactNode;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Button.d.ts.map