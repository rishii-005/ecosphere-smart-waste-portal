/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"]
      },
      colors: {
        ink: "#101414",
        moss: "#2f6f57",
        mint: "#4ade80",
        aqua: "#22d3ee",
        sun: "#f5c84c",
        coral: "#fb7185"
      },
      boxShadow: {
        glow: "0 18px 70px rgba(74, 222, 128, 0.24)"
      }
    }
  },
  plugins: []
};
