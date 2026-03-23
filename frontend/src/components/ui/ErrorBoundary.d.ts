import React from "react";
interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}
interface State {
    hasError: boolean;
    error: Error | null;
}
export declare class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): State;
    handleRetry: () => void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map