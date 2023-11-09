/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    // borderRadius: {
    //   'lg': '16px'
    // },
    tab: {
      styles: {
        base: {
          indicator: {
            borderRadius: "rounded-[14px]"
          },
        },
      },
    },
    extend: {}
  },
  plugins: []
});
