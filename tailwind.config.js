/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe8ee',
          200: '#ffd0dc',
          300: '#ffb3c6',
          400: '#ff8fac',
        },
        cream: {
          50: '#fffdf7',
          100: '#fff8e8',
          200: '#ffefc9',
        },
        sky: {
          50: '#f2fbff',
          100: '#e0f5ff',
          200: '#c3ebff',
          300: '#9adcff',
        },
        mint: {
          50: '#f3fdf9',
          100: '#e1f9ee',
          200: '#c2f0dc',
        },
        lavender: {
          50: '#f8f6ff',
          100: '#ece5ff',
          200: '#d9caff',
        },
        ink: '#4a3f4d',
      },
      fontFamily: {
        heading: ['"Quicksand"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(255, 143, 172, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
