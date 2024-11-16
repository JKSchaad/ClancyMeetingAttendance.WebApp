/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',     // Clancy Blue
        secondary: '#059669',   // Success Green
        accent: '#DC2626',      // Alert Red
        background: '#F3F4F6',
        text: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-1': '24px',
        'heading-2': '20px',
        'heading-3': '18px',
        'body': '16px',
        'small': '14px',
      },
      spacing: {
        'base': '4px',
        'standard': '16px',
        'medium': '24px',
        'large': '32px',
      },
    },
  },
  plugins: [],
}
