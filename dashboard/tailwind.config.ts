import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
      },

      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'display-2xl': ['clamp(4rem, 10vw, 9rem)', { lineHeight: '1.1' }],
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1.1' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.2' }],
        'body-lg': ['1.25rem', { lineHeight: '1.8' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
      },

      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0em',
        'wide': '0.04em',
        'display': '0.08em',
      },

      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'scroll-indicator': 'scroll-indicator 1.5s ease-in-out infinite',
      },

      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(10 10 10 / 0.7)' },
          '50%': { boxShadow: '0 0 0 8px rgb(10 10 10 / 0)' },
        },
        'scroll-indicator': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(20px)' },
        },
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'base': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        'lift': '0 20px 40px -10px rgb(0 0 0 / 0.2)',
        'glow': '0 0 20px 0 rgb(0 0 0 / 0.15)',
      },

      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'pill': '9999px',
      },

      spacing: {
        'section': 'clamp(4rem, 10vw, 8rem)',
        'gutter': 'clamp(1rem, 5vw, 4rem)',
      },

      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },

      opacity: {
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
      },
    },
  },

  plugins: [typography],
} satisfies Config;
