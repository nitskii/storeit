import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{html,tsx}"
  ],
  plugins: [
    require("@tailwindcss/forms")
  ],
} satisfies Config;