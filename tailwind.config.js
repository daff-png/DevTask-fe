/** @type {import('tailwindcss').Config} */
export default {
  content: ['.index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: '#F5EBE4',
          panel: 'F8F3F0',
          ink: '#1A1A1A',
          accent: '#6C63FF',
          muted: '#8A8580',
          tan: '#F2D988',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

