import type { Config } from "tailwindcss";

/**
 * LexNova design tokens.
 *
 * Tailwind v4 also reads these via `@config` in `src/app/globals.css`.
 * Use these names on every page: `bg-paper`, `text-ink`, `text-accent`,
 * `font-serif` (headings), `font-sans` (body). Do not introduce ad-hoc palettes.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12263A",
          muted: "#3D5166",
        },
        paper: {
          DEFAULT: "#F5F0E6",
          muted: "#E8E1D4",
        },
        accent: {
          DEFAULT: "#B08D57",
          foreground: "#12263A",
        },
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
};

export default config;
