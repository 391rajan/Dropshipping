/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald-500
        },
        accent: {
          DEFAULT: '#64748b', // Slate-500
        },
        background: {
          DEFAULT: '#f1f5f9', // Slate-50
        },
        text: {
          DEFAULT: '#0f172a', // Slate-900
        },
      },
    },
  },
  plugins: [],
}