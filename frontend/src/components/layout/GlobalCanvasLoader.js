import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, memo, Suspense, useEffect, useState } from "react";
const GlobalCanvas = lazy(() => import("../3d/GlobalCanvas").then((m) => ({ default: m.GlobalCanvas })));
export const GlobalCanvasLoader = memo(function GlobalCanvasLoader() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(() => setReady(true), {
                timeout: 3000,
            });
            return () => window.cancelIdleCallback(id);
        }
        // Fallback for Safari
        const timer = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(timer);
    }, []);
    if (!ready)
        return null;
    return (_jsx(Suspense, { fallback: null, children: _jsx(GlobalCanvas, {}) }));
});
//# sourceMappingURL=GlobalCanvasLoader.js.map