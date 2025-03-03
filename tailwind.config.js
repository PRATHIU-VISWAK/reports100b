/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        muted: {
          DEFAULT: '#111111',
          foreground: '#999999',
        },
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#171717',
          foreground: '#ffffff',
        },
        border: '#222222',
        accent: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
      },
    },
  },
}
