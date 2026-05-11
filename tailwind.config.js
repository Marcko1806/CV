/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ef',
          500: '#3d6a9e',
          700: '#1e3a5f',
          800: '#162d4a',
          900: '#0f1f35',
        },
      },
    },
  },
  plugins: [],
}

