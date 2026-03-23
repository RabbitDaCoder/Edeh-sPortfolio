import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../utils/cn";
export function Skeleton({ className }) {
    return (_jsx("div", { className: cn("rounded-md animate-shimmer", className ?? "h-12 w-full"), style: {
            backgroundImage: "linear-gradient(90deg, var(--surface) 25%, var(--border) 50%, var(--surface) 75%)",
            backgroundSize: "400px 100%",
        } }));
}
//# sourceMappingURL=Skeleton.js.map