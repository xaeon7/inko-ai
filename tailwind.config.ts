import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      danger: { DEFAULT: "#fe4b4b" },
      warning: { DEFAULT: "#ffb01e" },
      transparent: "transparent",
      main: { DEFAULT: "#24A1FC", 500: "#196F97" },
      neutral: {
        50: "#FBFBFA",
        100: "#CFCDE4",
        200: "#A4A1C8",
        400: "#7773AF",
        600: "#262347",
        800: "#141324",
        900: "#100F1C",
        950: "#0c0b16 ",
      },
    },
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      typography: {
        sm: {
          css: {
            a: {
              color: "#24A1FC",
              "&:hover": {
                color: "#196F97",
              },
            },
            li: {
              listStyle: "initial",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
export default config;
