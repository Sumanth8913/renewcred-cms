/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D62828',
          dark: '#B01E1E',
          50: '#FDF0EF',
        },
        ink: '#171717',
      },
    },
  },
  plugins: [],
};
