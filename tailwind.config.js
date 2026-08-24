/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          900: '#173C2D',
          800: '#1F533E',
          700: '#2B6E4F',
          600: '#3D8C66',
          500: '#52B788',
          400: '#74C69D',
          300: '#95D5B2',
          200: '#B7E4C7',
          100: '#D8F3DC',
          50: '#EDF9F1',
        },
        wheat: {
          50: '#FDFBF7',
          100: '#FBF7ED',
          200: '#F3ECDA',
          300: '#E8DDC3',
          400: '#DCCDAA',
        },
        soil: {
          900: '#422A17',
          800: '#5B3A21',
          700: '#734A2A',
          600: '#8A5A34',
          500: '#A46F44',
          400: '#BD895B',
          300: '#D3A77C',
        },
        amber: {
          50: '#FFF9ED',
          100: '#FEF0D4',
          200: '#FCE0A8',
          300: '#FACB77',
          400: '#F7B03F',
          500: '#E38A1C',
          600: '#C26F0E',
          700: '#9E5507',
        },
        ink: {
          900: '#20261F',
          700: '#343E33',
          600: '#4C5548',
          400: '#737E70',
          300: '#9AA497',
        },
        line: '#E1D9C4',
      },
      fontFamily: {
        heading: ['"Baloo 2"', '"Noto Sans Bengali"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', '"Hind Siliguri"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', '"Hind"', 'sans-serif'],
        sans: ['"Noto Sans"', '"Noto Sans Bengali"', '"Noto Sans Devanagari"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'custom': '16px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'agri': '0 10px 30px -12px rgba(23,60,45,.16)',
        'agri-sm': '0 2px 8px 0 rgba(23,60,45,.06)',
        'agri-md': '0 8px 24px -6px rgba(23,60,45,.12)',
        'agri-hover': '0 12px 32px -8px rgba(23,60,45,.22)',
      },
    },
  },
  plugins: [],
}
