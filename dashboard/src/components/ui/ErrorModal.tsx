import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: ErrorModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border/60 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-border/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold text-text-primary mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-background hover:opacity-90 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
