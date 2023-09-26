/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        secondary: '#34C759',
        bg: '#F5F5F5',
        body: '#F5F5F5',
        other: '#FFD700',
        text: ' #333333',
      },
    },
    fontFamily: {
      header: 'mooli',
      body: 'roboto',
      menu: 'poppins',
    },
  },
  plugins: [],
};
