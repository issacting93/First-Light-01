/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require('@firstlight/tokens/tailwind.preset')],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
}