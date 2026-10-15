/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#07090e",
          900: "#0d1117",
          850: "#131822",
          800: "#1a2232",
          700: "#263248",
          600: "#3d4f70",
          500: "#5c73a0",
          400: "#8ca1c7",
          300: "#b5c5e3",
          100: "#eaf0fa",
        },
        brand: {
          cyan: "#00f2fe",
          blue: "#4facfe",
          purple: "#7f5af0",
          violet: "#9d4edd",
          pink: "#ff416c",
          amber: "#f59e0b",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(127, 90, 240, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.4)",
        "glow-pink": "0 0 25px -5px rgba(255, 65, 108, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
