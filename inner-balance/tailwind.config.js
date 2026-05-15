/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      boxShadow: {
        glass: '0 24px 80px rgba(14, 30, 37, 0.18)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(167,139,250,0.25), transparent 40%), linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)'
      }
    }
  },
  plugins: [],
};
