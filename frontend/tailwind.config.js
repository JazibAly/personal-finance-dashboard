/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Manrope",
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f1f5f9",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#64748b",
          subtle: "#94a3b8",
        },
        brand: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          soft: "#eff6ff",
        },
        accent: {
          income: "#059669",
          expense: "#dc2626",
          savings: "#7c3aed",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)",
        sidebar: "4px 0 24px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
