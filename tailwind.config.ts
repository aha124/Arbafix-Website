import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        "text-dark": "#1e293b",
        "text-body": "#64748b",
        "bg-light": "#f8fafc",
        success: "#16a34a",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
