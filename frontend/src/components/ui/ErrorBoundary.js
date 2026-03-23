import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { RefreshCw, WifiOff } from "lucide-react";
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: null });
            }
        });
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-6 text-center", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5", children: _jsx(WifiOff, { className: "w-6 h-6 text-red-500" }) }), _jsx("h2", { className: "text-lg font-semibold text-text-primary mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-text-muted max-w-md mb-6", children: "This section couldn't load \u2014 the server may be unavailable. Your other content is unaffected." }), _jsxs("button", { onClick: this.handleRetry, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-background hover:opacity-90 transition-opacity", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Try again"] })] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map