/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ras: {
          blue: '#2C3787',
          purple: '#6B3FA0',
          yellow: '#F7C948',
          red: '#D7263D',
          white: '#F8F9FA',
        },
      },
    },
  },
  plugins: [],
}

