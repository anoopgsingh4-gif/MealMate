/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        cardHover: "0 2px 6px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.10)",
        ring: "0 0 0 3px rgba(16, 185, 129, 0.25)",
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      transitionTimingFunction: {
        pleasant: "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [],
};
