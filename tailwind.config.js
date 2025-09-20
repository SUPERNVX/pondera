/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: '#6e56cf',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#e4dfff',
          foreground: '#4a4080',
        },
        text: {
          DEFAULT: '#2a2a4a',
        },
        background: {
          DEFAULT: '#ffffff',
        },
        // Dark mode colors
        'primary-dark': '#a48fff',
        'primary-foreground-dark': '#0f0f1a',
        'secondary-dark': '#2d2b55',
        'secondary-foreground-dark': '#c4c2ff',
        'text-dark': '#e2e2f5',
        'background-dark': '#0f0f1a',
        // Additional utility colors
        border: {
          DEFAULT: '#e4dfff',
          dark: '#2d2b55',
        },
        muted: {
          DEFAULT: '#f8f7ff',
          foreground: '#6b7280',
          dark: '#1a1a2e',
          'foreground-dark': '#9ca3af',
        },
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 50%, #e4dfff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #2d2b55 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(110, 86, 207, 0.1)',
        'soft-dark': '0 4px 20px rgba(164, 143, 255, 0.1)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#6e56cf',
          'primary-content': '#ffffff',
          'secondary': '#e4dfff',
          'secondary-content': '#4a4080',
          'accent': '#a48fff',
          'accent-content': '#0f0f1a',
          'neutral': '#f8f7ff',
          'neutral-content': '#2a2a4a',
          'base-100': '#ffffff',
          'base-200': '#f8f7ff',
          'base-300': '#e4dfff',
          'base-content': '#2a2a4a',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
        dark: {
          'primary': '#a48fff',
          'primary-content': '#0f0f1a',
          'secondary': '#2d2b55',
          'secondary-content': '#c4c2ff',
          'accent': '#6e56cf',
          'accent-content': '#ffffff',
          'neutral': '#1a1a2e',
          'neutral-content': '#e2e2f5',
          'base-100': '#0f0f1a',
          'base-200': '#1a1a2e',
          'base-300': '#2d2b55',
          'base-content': '#e2e2f5',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
};