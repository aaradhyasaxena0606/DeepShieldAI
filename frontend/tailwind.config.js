// Extend Tailwind theme: Add custom colors (primary-blue: #3B82F6, danger-red: #EF4444, success-green: #10B981)
// Configure content paths: ['./index.html', './src/**/*.{js,jsx}'] for purging unused CSS

// VoiceGuard AI - Tailwind CSS Configuration
// Premium Dark Color Scheme: Black, Dark Brown, Maroon, Beige, Greenish Beige

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Maroon/Deep Red - Primary color
        maroon: {
          50: '#FFF5F5',
          100: '#FFE0E0',
          200: '#FFC2C2',
          300: '#FF9999',
          400: '#E85D5D',
          500: '#A52A2A',
          600: '#8B0000',
          700: '#6B0000',
          800: '#4A0000',
          900: '#2B0000',
        },
        // Beige - Secondary color
        beige: {
          50: '#FEFDFB',
          100: '#F5F5DC',
          200: '#E8E4D0',
          300: '#D2B48C',
          400: '#C9B896',
          500: '#A89968',
          600: '#8B8B7A',
          700: '#6B6B5A',
          800: '#4A4A3A',
          900: '#2B2B1A',
        },
        // Brown - Background accents
        brown: {
          50: '#F5F0EB',
          100: '#E0D5CC',
          200: '#C2AFA0',
          300: '#A89988',
          400: '#8B7355',
          500: '#6B5842',
          600: '#4A3F2F',
          700: '#3A2F1F',
          800: '#1A0F0A',
          900: '#0A0503',
        },
        // Additional semantic colors
        primary: {
          DEFAULT: '#8B0000',
          dark: '#6B0000',
          light: '#A52A2A'
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 0, 0, 0.6)',
        'glow-sm': '0 0 10px rgba(139, 0, 0, 0.4)',
        'glow-lg': '0 0 30px rgba(139, 0, 0, 0.8)',
        'beige-glow': '0 0 20px rgba(245, 245, 220, 0.3)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1A0F0A 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
        'beige-gradient': 'linear-gradient(135deg, #F5F5DC 0%, #D2B48C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 0, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 0, 0, 0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
