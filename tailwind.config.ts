import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addComponents }: { addComponents: (components: Record<string, any>) => void }) {
      addComponents({
        ".section-title": {
          "@apply mb-4 text-2xl font-bold": {},
        },
      });
    }),
  ],
};
export default config;