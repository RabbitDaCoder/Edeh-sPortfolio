import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
      },

      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "display-2xl": [
          "clamp(4rem,10vw,9rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "display-xl": [
          "clamp(3rem,7vw,6rem)",
          { lineHeight: "1.0", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem,4vw,3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.5rem,3vw,2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        "body-lg": ["1.25rem", { lineHeight: "1.8" }],
        "body-md": ["1rem", { lineHeight: "1.75" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },

      spacing: {
        section: "8rem",
        "section-sm": "5rem",
      },

      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        pill: "9999px",
      },

      zIndex: {
        "-1": "-1",
        "1": "1",
      },

      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        grain: "grain 0.4s steps(1) infinite",
      },

      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(2%, -1%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "60%": { transform: "translate(1%, 3%)" },
          "70%": { transform: "translate(-2%, -2%)" },
          "80%": { transform: "translate(3%, -3%)" },
          "90%": { transform: "translate(-1%, 2%)" },
        },
      },
    },
  },

  plugins: [typography],
} satisfies Config;
