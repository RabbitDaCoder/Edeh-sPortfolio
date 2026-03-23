import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WifiOff } from "lucide-react";
export function SectionError({ message = "This section is temporarily unavailable.", }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-6 text-center opacity-60", children: [_jsx(WifiOff, { className: "w-5 h-5 text-text-muted mb-3" }), _jsx("p", { className: "text-sm text-text-muted", children: message })] }));
}
//# sourceMappingURL=SectionError.js.map