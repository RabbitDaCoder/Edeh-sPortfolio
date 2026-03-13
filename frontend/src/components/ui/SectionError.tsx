import { WifiOff } from "lucide-react";

interface SectionErrorProps {
  message?: string;
}

export function SectionError({
  message = "This section is temporarily unavailable.",
}: SectionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center opacity-60">
      <WifiOff className="w-5 h-5 text-text-muted mb-3" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
