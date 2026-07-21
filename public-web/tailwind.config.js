/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D62828',
          dark: '#B01E1E',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#4B4B4B',
        },
        footer: '#1C1C1C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
