module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marble: '#F8F8F7',
        primary: {
          DEFAULT: '#D4AF37',
          light: '#FFD966',
          dark: '#A67C1A'
        },
        secondary: {
          DEFAULT: '#C0C0C0'
        },
        warning: {
          DEFAULT: '#DC143C'
        }
      }
    },
  },
  plugins: [],
};
