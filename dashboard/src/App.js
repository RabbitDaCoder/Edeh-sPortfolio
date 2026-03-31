import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Routes } from "./routes";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ToastContainer } from "./components/ui/Toast";
import "./index.css";
export function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: "Loading..." }), children: _jsx(Routes, {}) }) }), _jsx(ToastContainer, {})] }));
}
//# sourceMappingURL=App.js.map