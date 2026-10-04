import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fbf7ef",
        linen: "#f3eadf",
        blush: "#d99a94",
        rose: "#bd7f78",
        cocoa: "#4e352b",
        bark: "#2f211c",
        taupe: "#8b7466",
        sage: "#8b9a88",
        butter: "#f1d5a6"
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(78, 53, 43, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
