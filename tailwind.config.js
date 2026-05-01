
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7f0",
          100: "#ffecd9",
          200: "#ffd0b3",
          300: "#ffad80",
          400: "#ff7f45",
          500: "#FF5A1F",
          600: "#e64a0a",
          700: "#bf3a08",
          800: "#99300d",
          900: "#7c2a0f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
