/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cycle-menstruation': '#E57373',
        'cycle-follicular': '#BA68C8',
        'cycle-ovulation': '#FFD54F',
        'cycle-luteal': '#4DB6AC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
