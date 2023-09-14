import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/views/*.html',
    './src/routes/*.tsx',
    './public/*.js'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
} satisfies Config;
