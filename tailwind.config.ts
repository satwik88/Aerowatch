import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lapis: {
          dark: "var(--color-lapis-dark)",
          mid: "var(--color-lapis-mid)",
        },
        plum: "var(--color-plum-magenta)",
        lilac: "var(--color-grey-lilac)",
        cream: "var(--color-cream)",
        purpleMuted: "var(--color-purple-muted)",
      },
    },
  },
  plugins: [],
};
export default config;
