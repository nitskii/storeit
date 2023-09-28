import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,tsx,js}'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
} satisfies Config;
