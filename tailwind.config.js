/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B2641',
          DEFAULT: '#0B6FDB',
          cyan: '#0BA6CC',
          soft: '#E3F0FF',
        },
        learn: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          soft: 'rgba(99, 102, 241, 0.12)',
        },
        surface: {
          light: '#FFFFFF',
          'light-2': '#F8FAFD',
          dark: '#0E1833',
          'dark-2': '#122042',
        },
        content: {
          light: '#0E1730',
          dark: '#E8EDFB',
          muted: '#5B6787',
          'muted-dark': '#9AA6C6',
        },
        border: {
          light: '#E6EAF3',
          dark: '#1B2950',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        btn: '11px',
        dialog: '24px',
      },
    },
  },
  plugins: [],
}
