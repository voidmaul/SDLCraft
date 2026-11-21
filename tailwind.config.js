/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          yellow: "#FFC908",
          "yellow-dark": "#E6B400",
          dark: "#0F172A",
          charcoal: "#111827",
        },
      },
      boxShadow: {
        "neo": "4px 4px 0px #0F172A",
        "neo-sm": "2px 2px 0px #0F172A",
        "neo-lg": "6px 6px 0px #0F172A",
        "neo-yellow": "4px 4px 0px #FFC908",
        "neo-blue": "4px 4px 0px #0284C7",
        "neo-green": "4px 4px 0px #10B981",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        "dot-grid-dark":
          "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-20": "20px 20px",
        "dot-24": "24px 24px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-x": "bounceX 1s ease-in-out infinite",
        "streak-pop": "streakPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        bounceX: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        streakPop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "80%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
