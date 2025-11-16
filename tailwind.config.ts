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
        ace: {
          navy: '#0a1e3d',
          blue: '#2563eb',
          orange: '#f97316',
          lightBlue: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
export default config;
