/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B0F2A',
        'bg-card': '#141836',
        'bg-table': '#101428',
        'border-subtle': '#1E2548',
        'accent-orange': '#FF6B00',
        'accent-cyan': '#00C5CD',
        'text-secondary': '#8A8FAD',
        'text-label': '#C0C4DB',
        'header-table': '#1A2050',
        'table-hover': '#1C2255',
      },
    },
  },
  plugins: [],
}
