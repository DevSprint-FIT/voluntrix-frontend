import type { Config } from "tailwindcss";
import { fontFamily } from 'tailwindcss/defaultTheme';
const {heroui} = require("@heroui/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        // foreground: "var(--foreground)",
        'verdant': {
            '50': '#ecfdf6',
            '100': '#d0fbe7',
            '200': '#a5f5d4',
            '300': '#6beabf',
            '400': '#30d7a3',
            '500': '#0cbc8b',
            '600': '#029972',
            '700': '#017b5e',
            '800': '#04614c',
            '900': '#045040',
            '950': '#012d25',
        },
        'shark': {
            '50': '#f6f6f6',
            '100': '#e7e7e7',
            '200': '#d1d1d1',
            '300': '#b0b0b0',
            '400': '#888888',
            '500': '#6d6d6d',
            '600': '#5d5d5d',
            '700': '#4f4f4f',
            '800': '#454545',
            '900': '#3d3d3d',
            '950': '#262626',
        },
      },
      fontFamily: {
        primary: ['UberMove', ...fontFamily.sans],
        secondary: ['UberMoveText', ...fontFamily.sans],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
