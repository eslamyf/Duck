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
          yellow: '#FDFB45',
          navy: '#0C1226',
          blue: '#147D9F',
          'yellow-legacy': '#F5E847',
          'navy-legacy': '#121528',
          'blue-legacy': '#067BA1',
        },
        surface: {
          mist: '#F3FAFC',
          mist2: '#E4F1F6',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 12px 32px rgba(12, 18, 38, 0.08)',
        'brand-lg': '0 20px 48px rgba(20, 125, 159, 0.12)',
      }
    },
  },
  plugins: [],
}
