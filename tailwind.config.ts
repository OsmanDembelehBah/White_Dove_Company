import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',   // indigo‑500
        secondary: '#a78bfa', // purple‑400
      },
    },
  },
  plugins: [],
};
