/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      // 'sans': ['ui-sans-serif', x', ...],
      // 'serif': ['ui-serif', 'Georgia', ...],
      'mono': ['Inconsolata', 'ui-monospace'],
      'sans': ['Montserrat', 'system-ui'],
      'display': ['Montserrat', 'system-ui']
    },
    extend: {
      scale: {
        '115': '1.1',
      },
      dropShadow: {
        'drop': '0 0px 15px rgba(247, 0, 255, 0.709)',
      },
      colors: {
        'base': {
          DEFAULT: '#3C5F80',
          '50': '#E0EBF0',
          '100': '#CBDDE7',
          '200': '#A1C0D3',
          '300': '#78A2BF',
          '400': '#5082AA',
          '500': '#3C5F80',
          '600': '#334E6C',
          '700': '#293D57',
          '800': '#1F2D42',
          '900': '#151E2D',
          '950': '#0c111a',
          '1000': '#080b10'
        }
      }
    },
  },
  variants: {},
  plugins: [
    // require('tailwind-scrollbar-hide')
  ],
  content: ["./components/**/*.{tsx,ts,html,js,jsx,css}", "./pages/**/*.{tsx,ts,html,js,jsx,css}"]
}