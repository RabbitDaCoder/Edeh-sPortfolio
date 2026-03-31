import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
export function ErrorModal({ isOpen, onClose, title = "Something went wrong", message = "An unexpected error occurred. Please try again.", }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            const handleEsc = (e) => {
                if (e.key === "Escape")
                    onClose();
            };
            document.addEventListener("keydown", handleEsc);
            return () => {
                document.body.style.overflow = "unset";
                document.removeEventListener("keydown", handleEsc);
            };
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-surface border border-border/60 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6", children: [_jsx("button", { onClick: onClose, className: "absolute top-3 right-3 p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors", children: _jsx(X, { className: "w-4 h-4" }) }), _jsx("div", { className: "w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-red-500" }) }), _jsx("h3", { className: "text-base font-semibold text-text-primary mb-1.5", children: title }), _jsx("p", { className: "text-sm text-text-muted leading-relaxed", children: message }), _jsx("div", { className: "flex gap-2 mt-5", children: _jsx("button", { onClick: onClose, className: "flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-background hover:opacity-90 transition-opacity", children: "Dismiss" }) })] })] }));
}
//# sourceMappingURL=ErrorModal.js.map