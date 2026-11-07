import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { sky: '#A7C7E7', mist: '#D6E8F5', navy: '#243B53', cloud: '#F7F9FC' },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 40px -12px rgba(36,59,83,.18)' },
    },
  },
  plugins: [],
};
export default config;
