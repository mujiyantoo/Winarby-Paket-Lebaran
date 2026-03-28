/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#FFF8E7',
          200: '#F5D27A',
          300: '#E8B84B',
          400: '#D4A030',
          500: '#C9973A',
          600: '#A67C2B',
          700: '#8A6420',
        },
        cream: {
          50:  '#FFFDF8',
          100: '#FFFBF2',
          200: '#FFF4E0',
          300: '#FFE8C4',
          400: '#FFD8A0',
        },
        brown: {
          100: '#C4956A',
          300: '#9B6B4A',
          500: '#6B4423',
          700: '#3D2B1F',
          900: '#1F1208',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold:     '0 4px 24px rgba(201,151,58,0.32)',
        'gold-lg':'0 8px 32px rgba(201,151,58,0.45)',
        card:     '0 4px 24px rgba(61,43,31,0.08)',
        'card-lg':'0 8px 32px rgba(61,43,31,0.12)',
      },
      backgroundImage: {
        'gold-btn': 'linear-gradient(135deg, #F5D27A 0%, #D4A030 50%, #A67C2B 100%)',
        'panel-l':  'linear-gradient(150deg, #FFF5DC 0%, #FFE6A8 35%, #FFCF70 72%, #F0B030 100%)',
      },
      animation: {
        'float-a': 'floatA 6.5s ease-in-out infinite',
        'float-b': 'floatB 5.8s ease-in-out infinite',
        'float-c': 'floatA 7s   ease-in-out infinite',
        'shimmer': 'shimmer 2.2s linear infinite',
        'rise-in': 'riseIn .65s cubic-bezier(.22,1,.36,1) both',
      },
      keyframes: {
        floatA: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '40%':     { transform: 'translateY(-11px) rotate(2.5deg)' },
          '70%':     { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        floatB: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '45%':     { transform: 'translateY(-9px) rotate(-2deg)' },
          '75%':     { transform: 'translateY(-3px) rotate(1deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
