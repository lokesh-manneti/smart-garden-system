/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        garden: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        sage: {
          50:  '#f6f7f4',
          100: '#e8eae2',
          200: '#d3d8c8',
          300: '#b4bda3',
          400: '#95a17e',
          500: '#788563',
          600: '#5e6a4d',
          700: '#4a543e',
          800: '#3d4534',
          900: '#353c2e',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Botanical Glass design system tokens
        botanical: {
          surface:     '#f9f9f9',
          'surface-low': '#f3f3f3',
          'surface-high': '#e8e8e8',
          'surface-card': '#ffffff',
          primary:     '#003526',
          'primary-container': '#004e39',
          secondary:   '#316763',
          'on-surface': '#1a1c1c',
          outline:     '#707974',
          'outline-light': '#bfc9c3',
        },
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0,0,0,0.04), 0 10px 20px -2px rgba(0,0,0,0.02)',
        'card':    '0 4px 25px -5px rgba(0,0,0,0.06)',
        'glow':    '0 8px 30px rgb(0,0,0,0.04)',
        'glass':   '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'ambient': '0 8px 30px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out',
        'fade-in-up':  'fadeInUp 0.6s ease-out both',
        'slide-up':    'slideUp 0.4s ease-out',
        'pulse-soft':  'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}