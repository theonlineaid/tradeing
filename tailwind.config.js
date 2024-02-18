/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./src/**/*.{jsx,js,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2e3192',
        'dark-50': '#131B2E',
        'dark-100': '#2B3037',
        'dark-200': '#141C26',
        'dark-300': '#15202F',
        'dark-400': '#1E293B',
        'dark-500': '#293548',
        'dark-border': '#1d2d40',

        'light-green' : "#c1f0d4",
        'dark-green': '#0e3a27',
        'darker-green': '#134e34',
        'light-red': '#fee2e2',
        'dark-red': '#600202',
        'darker-red': '#3d0707',
        'dark-gray': '#bfbfbf',
        orange: '#D35400',

        'dark-purple': '#816bff ',
        'dark-blue': '#6576ff',
        'purple-dim' : '#252447 '
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
  darkMode: 'class',
}
