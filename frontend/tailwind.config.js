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
          black: "#121212",
        },
      },
            boxShadow: {
        ras: "0 10px 30px rgba(229, 26, 76, .25)",
        glass: "inset 0 1px 0 rgba(255,255,255,.2), 0 10px 25px rgba(0,0,0,.25)"
      },
      backdropBlur: { xs: "2px" },
      borderRadius: { xl2: "1rem" }
    },
  },
  plugins: [],
}

