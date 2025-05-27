// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // A blue shade
        secondary: '#60A5FA', // A lighter blue
        dark: '#1F2937', // Dark gray for background
        darker: '#111827', // Even darker for elements
        text: '#F9FAFB', // Light text
        accent: '#EC4899', // Pink for accents
      },
    },
  },
  plugins: [],
};