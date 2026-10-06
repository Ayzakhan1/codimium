/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#035382",
          hover: "#075985",
        },
        ink: {
          DEFAULT: "#1D293D",
          secondary: "#475467",
          muted: "#667085",
        },
        background: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        success: "#16A34A",
        error: "#DC2626",
      },
    },
  },
  plugins: [],
};