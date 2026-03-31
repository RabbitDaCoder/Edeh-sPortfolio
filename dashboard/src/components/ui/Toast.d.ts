type ToastType = "error" | "success" | "info" | "warning";
interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}
export declare function showToast(toast: Omit<Toast, "id">): void;
export declare function ToastContainer(): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=Toast.d.ts.map