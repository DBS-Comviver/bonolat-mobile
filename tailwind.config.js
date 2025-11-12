/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#FFFFFF",
          dark: "#0F172A",
        },
        text: {
          light: "#0F172A",
          dark: "#F8FAFC",
        },
        primary: "#06B6D4",
        secondary: "#9333EA",
        "auth-dark": "#0A1A2E",
      },
    },
  },
  plugins: [],
};
