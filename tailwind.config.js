/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  /*
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  */
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    //require('daisyui'),
    daisyui,
  ],
}

