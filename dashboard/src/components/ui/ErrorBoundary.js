import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
export class ErrorBoundary extends Component {
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
    componentDidCatch(error, info) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px] p-8 text-center", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4", children: _jsx(AlertTriangle, { className: "w-7 h-7 text-red-500" }) }), _jsx("h2", { className: "text-lg font-semibold text-text-primary mb-1", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-text-muted max-w-sm mb-5", children: "An unexpected error occurred. Please try again or contact support if the problem persists." }), _jsxs("button", { onClick: this.handleRetry, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-background hover:opacity-90 transition-opacity", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Try again"] })] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map