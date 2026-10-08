/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        kr: {
          maroon: '#6B0021',
          maroonDark: '#4A0017',
          gold: '#C99726',
          goldLight: '#E8CA72',
          blush: '#FFF5F7',
          blushBorder: '#FDE2E8',
          textMuted: '#6B7280',
        }
      }
    },
  },
  darkMode: "class",
  plugins: [require("./heroui.plugin.js")],
};
