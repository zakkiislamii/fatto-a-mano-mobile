/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C2C54",
          dark: "#1e293b",
        },
        screenLight: "#e2e8f0",
        screenDark: "#111827",
        cardLight: "#ffffff",
        cardDark: "#1e293b",
        textPrimaryLight: "#1e293b",
        textPrimaryDark: "#ffffff",
        textSecondaryLight: "#64748b",
        textSecondaryDark: "#d1d5db",
        textMutedLight: "#64748b",
        textMutedDark: "#9ca3af",
        button: {
          light: "#2C2C54",
          dark: "#3f3f9a",
        },
        success: {
          "light-bg": "#bbf7d0",
          light: "#166534",
          "dark-bg": "#14532d",
          dark: "#bbf7d0",
        },
        danger: {
          "light-bg": "#fff1f2",
          light: "#9f1239",
          "dark-bg": "#881337",
          dark: "#fecdd3",
        },
        info: {
          "light-bg": "#BFDBFE",
          light: "#3730a3",
          "dark-bg": "#312e81",
          dark: "#c7d2fe",
        },
        neutral: {
          "light-bg": "#f1f5f9",
          light: "#334155",
          "dark-bg": "#334155",
          dark: "#e2e8f0",
        },
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
      },
    },
  },
  plugins: [],
};
