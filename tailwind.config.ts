import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{tsx,js}'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
} satisfies Config;
