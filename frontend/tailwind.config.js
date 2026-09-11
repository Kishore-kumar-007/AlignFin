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
          bg: '#F7F5F0',
          card: '#FFFFFF',
          primary: '#18221F',
          secondary: '#66716D',
          accent: '#176B5B',
          accent2: '#C7A96B',
          border: '#E2E0D9',
          success: '#2F7D5C',
          warning: '#B47A35',
          danger: '#B94A48'
        }
      }
    },
  },
  plugins: [],
}
