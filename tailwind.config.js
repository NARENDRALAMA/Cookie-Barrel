/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6bb77',
          400: '#f1943d',
          500: '#ed7516',
          600: '#de5a0c',
          700: '#b8440c',
          800: '#933612',
          900: '#762e12',
        },
        cookie: {
          50: '#fdf8f3',
          100: '#fbe8d9',
          200: '#f5d0b5',
          300: '#edb088',
          400: '#e4855a',
          500: '#dc6a3a',
          600: '#cd522f',
          700: '#aa4129',
          800: '#8a3728',
          900: '#723024',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
