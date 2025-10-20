/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from the Ndigbo Viva logo
        brand: {
          gold: {
            DEFAULT: '#eab308',
            light: '#fbbf24',
            dark: '#d97706',
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#eab308',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          forest: {
            DEFAULT: '#166534',
            light: '#22c55e',
            dark: '#14532d',
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          red: {
            DEFAULT: '#dc2626',
            light: '#ef4444',
            dark: '#991b1b',
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          bronze: {
            DEFAULT: '#a16207',
            light: '#d97706',
            dark: '#78350f',
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#f59e0b',
            500: '#d97706',
            600: '#c2410c',
            700: '#a16207',
            800: '#92400e',
            900: '#78350f',
          },
        },
        // Warm neutral palette
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        cream: {
          DEFAULT: '#fffbeb',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cultural-gradient': 'linear-gradient(135deg, var(--brand-bronze), var(--brand-bronze-light))',
        'hero-gradient': 'linear-gradient(135deg, var(--brand-gold), var(--brand-gold-light))',
      },
      boxShadow: {
        'brand-gold': '0 4px 6px -1px rgba(234, 179, 8, 0.1), 0 2px 4px -1px rgba(234, 179, 8, 0.06)',
        'brand-forest': '0 4px 6px -1px rgba(22, 101, 52, 0.1), 0 2px 4px -1px rgba(22, 101, 52, 0.06)',
        'brand-bronze': '0 4px 6px -1px rgba(161, 98, 7, 0.1), 0 2px 4px -1px rgba(161, 98, 7, 0.06)',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}