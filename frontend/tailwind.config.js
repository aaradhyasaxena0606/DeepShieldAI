/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8'
        },
        success: '#10B981',
        danger: '#EF4444'
      },
      boxShadow: {
        glow: '0 0 8px rgba(99,102,241,0.6)'
      }
    },
  },
  plugins: [],
}

