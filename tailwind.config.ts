import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { paper: "#F6F7F5", surface: "#FFFFFF", ink: "#16233F", "ink-soft": "#2A3A5C", muted: "#5B6472", line: "#DEE1DC", brass: "#B8863C", "brass-deep": "#93692B", verified: "#3B7A57", flag: "#A6432E" },
      fontFamily: { display: ["var(--font-fraunces)", "serif"], body: ["var(--font-plex-sans)", "sans-serif"], mono: ["var(--font-plex-mono)", "monospace"] }
    }
  },
  plugins: []
} satisfies Config;
