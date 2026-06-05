import daisyui from 'daisyui'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        cta: '#F97316',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.08)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#3B82F6',
          'primary-focus': '#2563EB',
          'primary-content': '#ffffff',
          'secondary': '#60A5FA',
          'accent': '#F97316',
          'neutral': '#1E293B',
          'base-100': '#F8FAFC',
          'base-200': '#F1F5F9',
          'base-300': '#E2E8F0',
          'base-content': '#1E293B',
          'info': '#0EA5E9',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
        },
        dark: {
          'primary': '#3B82F6',
          'primary-focus': '#60A5FA',
          'primary-content': '#ffffff',
          'secondary': '#1D4ED8',
          'accent': '#F97316',
          'neutral': '#E2E8F0',
          'base-100': '#0F172A',
          'base-200': '#1E293B',
          'base-300': '#334155',
          'base-content': '#F1F5F9',
          'info': '#38BDF8',
          'success': '#34D399',
          'warning': '#FCD34D',
          'error': '#F87171',
        },
      },
    ],
  },
}
