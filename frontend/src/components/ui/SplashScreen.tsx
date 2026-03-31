import { useEffect, useState, useRef } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type LogLevel = "info" | "success" | "warn" | "error" | "system";

interface LogLine {
  id: number;
  level: LogLevel;
  prefix: string;
  message: string;
  timestamp: string;
}

export interface BootTask {
  label: string;
  run: () => Promise<void>;
}

interface SplashScreenProps {
  onReady: () => void;
  appName?: string;
  version?: string;
  tasks: BootTask[];
  minDisplayMs?: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function nowStamp(): string {
  return new Date().toISOString().split("T")[1].replace("Z", "");
}

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

const LEVEL_META: Record<LogLevel, { badge: string; color: string }> = {
  system: { badge: "SYS ", color: "var(--text-muted)" },
  info: { badge: "INFO", color: "var(--text-muted)" },
  success: { badge: " OK ", color: "#4ade80" },
  warn: { badge: "WARN", color: "#fbbf24" },
  error: { badge: "ERR ", color: "#f87171" },
};

// ─── SplashScreen ────────────────────────────────────────────────────────────

export function SplashScreen({
  onReady,
  appName = "EDEH CHINEDU",
  version = "1.0.0",
  tasks,
  minDisplayMs = 2000,
}: SplashScreenProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"booting" | "done" | "fading">("booting");
  const [cursor, setCursor] = useState(true);
  const idRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [lines]);

  // Boot sequence
  useEffect(() => {
    const push = (level: LogLevel, prefix: string, message: string) => {
      idRef.current += 1;
      setLines((prev) => [
        ...prev,
        { id: idRef.current, level, prefix, message, timestamp: nowStamp() },
      ]);
    };

    async function boot() {
      const startTime = Date.now();

      push("system", "BOOT", `Starting ${appName} v${version}`);
      push("system", "BOOT", `Env: ${import.meta.env?.MODE ?? "production"}`);
      push("info", "INIT", "Initialising runtime environment…");

      await delay(400);
      push(
        "info",
        "INIT",
        `Loading ${tasks.length} service${tasks.length !== 1 ? "s" : ""}…`,
      );
      await delay(300);

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        push("info", "TASK", `» ${task.label}`);

        try {
          await task.run();
          push("success", "DONE", `${task.label} — ready`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          push("warn", "WARN", `${task.label} — degraded (${msg})`);
        }

        setProgress(Math.round(((i + 1) / tasks.length) * 100));
      }

      await delay(300);
      push("success", "BOOT", "All services initialised.");
      push("system", "BOOT", "Handing off to application…");

      const elapsed = Date.now() - startTime;
      if (elapsed < minDisplayMs) await delay(minDisplayMs - elapsed);

      setPhase("done");
      await delay(600);
      setPhase("fading");
      await delay(700);
      onReady();
    }

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = phase === "done" || phase === "fading";

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 transition-opacity duration-700"
      style={{
        background: "var(--background)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        opacity: phase === "fading" ? 0 : 1,
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* Corner decorations */}
      <CornerDeco pos="top-left" />
      <CornerDeco pos="top-right" />
      <CornerDeco pos="bottom-left" />
      <CornerDeco pos="bottom-right" />

      {/* Content */}
      <div className="w-full max-w-[780px] flex flex-col gap-6 relative z-10">
        {/* Banner */}
        <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <pre
            className="leading-tight m-0 overflow-hidden select-none"
            style={{
              color: "var(--text-primary)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textShadow: "0 0 20px rgba(240,240,240,0.15)",
            }}
          >{`
 ███████╗██████╗ ███████╗██╗  ██╗
 ██╔════╝██╔══██╗██╔════╝██║  ██║
 █████╗  ██║  ██║█████╗  ███████║
 ██╔══╝  ██║  ██║██╔══╝  ██╔══██║
 ███████╗██████╔╝███████╗██║  ██║
 ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝`}</pre>
          <div className="flex justify-between mt-2">
            <span
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--text-primary)" }}
            >
              {appName}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              v{version}
            </span>
          </div>
        </div>

        {/* Terminal log */}
        <div
          ref={logRef}
          className="rounded-md p-4 h-[240px] overflow-y-auto flex flex-col gap-0.5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {lines.map((line) => {
            const meta = LEVEL_META[line.level];
            return (
              <div
                key={line.id}
                className="flex gap-2 text-xs leading-relaxed"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
              >
                <span className="shrink-0" style={{ color: "var(--border)" }}>
                  {line.timestamp}
                </span>
                <span
                  className="shrink-0 min-w-[36px] font-semibold tracking-wide"
                  style={{ color: meta.color }}
                >
                  [{meta.badge}]
                </span>
                <span
                  className="shrink-0 min-w-[36px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {line.prefix}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {line.message}
                </span>
              </div>
            );
          })}

          {/* Blinking prompt */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {">"}
            </span>
            <span
              className="inline-block w-2 h-3.5 rounded-[1px] transition-colors duration-100"
              style={{
                background: cursor ? "var(--text-primary)" : "transparent",
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div
            className="h-[3px] rounded-full overflow-hidden relative"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-400 ease-out"
              style={{
                width: `${progress}%`,
                background: isDone
                  ? "linear-gradient(90deg, #4ade80, var(--text-primary))"
                  : `linear-gradient(90deg, var(--text-muted), var(--text-primary))`,
                boxShadow: isDone
                  ? "0 0 8px rgba(74,222,128,0.4)"
                  : "0 0 8px rgba(240,240,240,0.2)",
              }}
            />
            {!isDone && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  animation: "splash-shimmer 1.8s infinite",
                }}
              />
            )}
          </div>
          <style>{`@keyframes splash-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }`}</style>
        </div>

        {/* Status line */}
        <div className="flex justify-between items-center">
          <span
            className="text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            {isDone ? "SYSTEM READY" : "BOOTING…"}
          </span>
          <span className="text-[11px]" style={{ color: "var(--border)" }}>
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Corner decoration ───────────────────────────────────────────────────────

function CornerDeco({
  pos,
}: {
  pos: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "var(--border)",
    borderStyle: "solid",
  };

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { top: 24, left: 24, borderWidth: "1px 0 0 1px" },
    "top-right": { top: 24, right: 24, borderWidth: "1px 1px 0 0" },
    "bottom-left": { bottom: 24, left: 24, borderWidth: "0 0 1px 1px" },
    "bottom-right": { bottom: 24, right: 24, borderWidth: "0 1px 1px 0" },
  };

  return <div style={{ ...base, ...positions[pos] }} />;
}
