/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garden: {
          50: '#f2fbf5',
          100: '#e1f6e8',
          200: '#c3ecd4',
          300: '#95dbb4',
          400: '#5ec28e',
          500: '#38a673',
          600: '#278459',
          700: '#216948',
          800: '#1e543b',
          900: '#194532',
        }
      }
    },
  },
  plugins: [],
}