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
          DEFAULT: '#FF6B35',
          dark: '#E0531F',
          light: '#FFF0EA',
        },
        secondary: {
          DEFAULT: '#FFC857',
          dark: '#EBB13A',
          light: '#FFF9EB',
        },
        accent: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#E8F5E9',
        },
        brandbg: '#FFF8F1',
        brandcard: '#FFFFFF',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6B6B',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'premium': '0 2px 12px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
