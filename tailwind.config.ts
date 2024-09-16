import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "translate-to-left": {
          from: {
            transform: "translateX(50%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "translate-to-right": {
          from: {
            transform: "translateX(-50%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "translate-to-up": {
          from: {
            transform: "translateY(50%)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "translate-to-right": "translate-to-right 0.5s ease-out",
        "translate-to-left": "translate-to-left 0.5s ease-out",
        "translate-to-up": "translate-to-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
