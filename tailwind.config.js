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
          yellow: 'var(--color-yellow)',
          navy: 'var(--color-navy)',
          blue: 'var(--color-blue)',
          'yellow-legacy': 'var(--color-yellow-legacy)',
          'navy-legacy': 'var(--color-navy-legacy)',
          'blue-legacy': 'var(--color-blue-legacy)',
          whatsapp: 'var(--color-whatsapp)',
        },
        surface: {
          white: 'var(--color-surface-white)',
          mist: 'var(--color-surface-mist)',
          mist2: 'var(--color-surface-mist2)',
          light: 'var(--color-surface-light)',
        }
      },
      fontFamily: {
        arabic: ['var(--font-arabic)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        cairo: ['var(--font-arabic)'],
        poppins: ['var(--font-body)'],
        sans: ['var(--font-body)'],
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'ocean': 'var(--shadow-ocean)',
        'header': 'var(--shadow-header)',
        'whatsapp': 'var(--shadow-whatsapp)',
      }
    },
  },
  plugins: [],
}
