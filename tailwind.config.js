/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Calm Medical brand palette
        'calm-purple': '#B391C8',
        'calm-periwinkle': '#6F7CFF',
        'calm-teal': '#7CC8B5',
        'calm-warm': '#E9DCC6',
        'calm-bg': '#F8F7FA',
        'calm-text': '#1A1625',
        'calm-muted': '#68627A',
        // Cycle phase colors
        'cycle-menstruation': '#E57373',
        'cycle-follicular': '#B391C8',
        'cycle-ovulation': '#7CC8B5',
        'cycle-luteal': '#6F7CFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'calm-gradient': 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)',
        'calm-gradient-soft': 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 40%, #7CC8B5 73%, #E9DCC6 100%)',
      },
      boxShadow: {
        'calm-sm': '0 4px 12px rgba(111, 124, 255, 0.08)',
        'calm-md': '0 8px 24px rgba(111, 124, 255, 0.12)',
      },
    },
  },
  plugins: [],
};
