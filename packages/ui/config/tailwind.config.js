// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMT = require('@material-tailwind/react/utils/withMT');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { blackA, blueA, whiteA } = require('@radix-ui/colors');

const alphaLevels = [...Array(11).keys()].map((i) => `A${i + 1}`);
const computeSecondaryAlphaLevels = (field, color) => {
  return Object.fromEntries(
    alphaLevels.map((a) => [
      `${field}${a}`,
      `hsl(var(--${color}) / var(--${a.toLowerCase()}))`
    ])
  );
};
const computeAlphaLevels = (color) => {
  return Object.fromEntries(
    alphaLevels.map((a) => [
      `${color}${a}`,
      `hsl(var(--${color}) / var(--${a.toLowerCase()}))`
    ])
  );
};

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../ui/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      colors: {
        ...blackA,
        ...blueA,
        ...whiteA,
        appBackground: 'hsl(var(--app-background))',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        ...computeAlphaLevels('foreground'),
        rio: {
          blue: 'hsl(var(--color-rio-blue) / <alpha-value>)'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          foregroundA1: 'hsl(var(--primary-foreground) / var(--a1))',
          ...computeSecondaryAlphaLevels('foreground', 'primary-foreground')
        },
        ...computeAlphaLevels('primary'),
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          ...computeSecondaryAlphaLevels('foreground', 'secondary-foreground')
        },
        ...computeAlphaLevels('secondary'),
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning-background))',
          foreground: 'hsl(var(--warning-foreground))',
          border: 'hsl(var(--warning-border))'
        }
      },
      keyframes: {
        'content-flipper-y': {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-100%)' }
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'skeleton-shine': {
          '0%': { transform: 'translateX(-40px)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'header-wallet-size': {
          '0%': { height: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'content-flipper-y':
          'content-flipper-y 4s alternate infinite cubic-bezier(0.75, 0, 0, 0.75)',
        spin: 'spin 0.8s linear infinite',
        'spin-ease-in-out': 'spin 0.8s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-1': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        'skeleton-shine':
          'skeleton-shine 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'header-wallet-size': 'header-wallet-size 3s ease-in-out infinite'
      },
      boxShadow: {
        cardlight: '1px 2px 3px 0 rgba(0, 0, 0, 0.15)',
        cardinactive: '1px 2px 2px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@tailwindcss/container-queries'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwindcss-animate'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwindcss-radix')({ variantPrefix: 'rdx' })
  ]
});
