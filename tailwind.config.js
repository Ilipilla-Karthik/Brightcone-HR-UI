/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0B2641',
        brand: '#0B6FDB',
        'brand-2': '#0BA6CC',
        'brand-soft': '#E3F0FF',
        'brand-teal': '#12C2A2',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'Figtree', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,23,48,.04),0 10px 30px -18px rgba(14,23,48,.20)',
        lg: '0 2px 4px rgba(14,23,48,.05),0 22px 44px -22px rgba(14,23,48,.32)',
      },
      borderRadius: {
        lg: '18px',
        md: '10px',
        sm: '7px',
      },
    },
  },
  plugins: [],
};
