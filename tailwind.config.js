/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          mint: '#DCF0E2',
          mintDeep: '#4E8664',
          lavender: '#E8E4F8',
          lavenderDeep: '#5B4F8E',
          peach: '#FDE4D2',
          peachDeep: '#A35C2B',
          rose: '#FCE0E8',
          roseDeep: '#9C3D5A',
          butter: '#FDF3CD',
          butterDeep: '#8A701A',
          sky: '#DBEAFE',
          skyDeep: '#2563EB',
          periwinkle: '#E0E7FF',
          periwinkleDeep: '#4338CA',
          sage: '#E3ECE6',
          sageDeep: '#3F6752'
        },
        surface: {
          canvas: '#FBFBFA',
          card: '#FFFFFF',
          muted: '#F4F4F2',
          border: '#E7E7E4',
          borderSoft: '#EFEFEA',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(28, 25, 23, 0.04), 0 1px 3px -1px rgba(28, 25, 23, 0.02)',
        'soft-hover': '0 8px 24px -4px rgba(28, 25, 23, 0.07), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'pastel-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}
