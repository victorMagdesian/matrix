/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',            // Vite’s entry HTML
    './src/**/*.{vue,js,ts,jsx,tsx}' // all your source files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        primary: { DEFAULT: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
        'surface-1': 'rgba(31, 41, 55, 0.6)'
      }
    }
  },
  plugins: []
}
