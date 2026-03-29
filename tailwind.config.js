/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c7dbfe',
          300: '#a4c4fc',
          400: '#819ff8',
          500: '#5c8ab9',
          600: '#4a7aa9',
          700: '#1e3a5f',
          800: '#0f2744',
          900: '#0a1929',
        },
        accent: {
          DEFAULT: '#9cbce2',
          hover: '#8baad1',
        },
      },
    },
  },
  plugins: [],
};
