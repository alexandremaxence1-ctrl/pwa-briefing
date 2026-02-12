/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper-base': '#Fdfbf7',
        'ink-black': '#1a1a1a',
        'stamp-red': '#b91c1c',
        'folder-manila': '#e0c097',
        'wood-desk': '#4a3b2a', 
      },
      fontFamily: {
        'typewriter': ['"Special Elite"', 'monospace'],
        'courier': ['"Courier Prime"', 'monospace'],
      },
      boxShadow: {
        'paper': '2px 2px 10px rgba(0, 0, 0, 0.1), 1px 1px 3px rgba(0, 0, 0, 0.1)',
        'folder': '5px 5px 15px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
