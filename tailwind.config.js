/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,njk}"],
  theme: {
    extend: {
      fontFamily: {
        title: "Open Sans",
        handwritten: "Caveat"
      }
    },
  },
  plugins: [],
}
