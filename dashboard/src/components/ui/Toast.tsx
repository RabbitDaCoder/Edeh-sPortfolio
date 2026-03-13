import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

type ToastType = "error" | "success" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function showToast(toast: Omit<Toast, "id">) {
  addToastFn?.(toast);
}

const icons: Record<ToastType, typeof AlertTriangle> = {
  error: XCircle,
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors: Record<ToastType, string> = {
  error: "bg-red-500/10 border-red-500/30 text-red-500",
  success: "bg-green-500/10 border-green-500/30 text-green-500",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-500",
};

const iconColors: Record<ToastType, string> = {
  error: "text-red-500",
  success: "text-green-500",
  info: "text-blue-500",
  warning: "text-amber-500",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    addToastFn = (toast) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...toast, id }]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timers.current.delete(id);
      }, 5000);
      timers.current.set(id, timer);
    };

    return () => {
      addToastFn = null;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-right ${colors[toast.type]}`}
          >
            <Icon
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="p-0.5 text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
