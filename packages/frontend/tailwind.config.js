/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['NB International Pro', 'ui-sans-serif', 'system-ui']
      // 'serif': ['ui-serif', 'Georgia', ...],
      // 'mono': ['ui-monospace', 'SFMono-Regular', ...],
      // 'display': ['Oswald', ...],
      // 'body': ['"Open Sans"', ...],
    }
  },
  plugins: []
});
