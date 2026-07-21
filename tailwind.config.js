/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zibah: {
          stores: '#002366',    // Deep Royal Blue[cite: 2]
          gold: '#FACF53',      // Golden Yellow[cite: 2]
          green: '#1D701E',     // Dark Green[cite: 2]
          light: '#ECF0F3',     // Light Gray[cite: 2]
          oxblood: '#4A0E17',   // Oxblood (Used for delete/destructive actions)[cite: 2]
        }
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'], // For headers and logos[cite: 1]
        body: ['Inter', 'sans-serif'],         // For tables and UI text[cite: 1]
      }
    },
  },
  plugins: [],
}