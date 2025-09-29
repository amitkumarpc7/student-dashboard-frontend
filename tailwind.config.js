/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightGray: "#f6f8fa",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
