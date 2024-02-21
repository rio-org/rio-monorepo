// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMT = require('@material-tailwind/react/utils/withMT');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { blackA, blueA, whiteA } = require('@radix-ui/colors');

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
        appBackground: 'var(--color-app-bg)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
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
