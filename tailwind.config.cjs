/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f5f0e8",
        ink: "#1a1008",
        "ink-light": "#3d2e1e",
        accent: "#c8102e",
        "ticker-bg": "#1a1008",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        baskerville: ["var(--font-libre-baskerville)", "Georgia", "serif"],
        fraktur: ["var(--font-unifraktur)", "serif"],
        mono: ["var(--font-source-code-pro)", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
