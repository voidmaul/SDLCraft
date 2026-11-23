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
          dark: "#0F172A",
        },
      },
      boxShadow: {
        "neo": "4px 4px 0px #0F172A",
        "neo-sm": "2px 2px 0px #0F172A",
        "neo-yellow": "4px 4px 0px #FFC908",
        "neo-blue": "4px 4px 0px #0284C7",
        "neo-green": "4px 4px 0px #10B981",
      },
    },
  },
  plugins: [],
};
