/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        fintech: {
          navy: '#0f172a',
          slate: '#1e293b',
          card: '#1e293b',
          border: '#334155',
          accent: '#38bdf8',
          gold: '#f59e0b',
          crimson: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
