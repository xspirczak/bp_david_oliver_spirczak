/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue' : '#212D40',
        'custom-dark-blue-hover' : '#364156',
        'custom-light-blue' : '#5EC9FF',
        'custom-light-blue-hover' : "#95C2D1",
      },
      width: {
        '284' : '284px',
      },
      height: {
        '284' : '284px',
      },
      borderRadius: {
        '54' : '54px',
        '91' : '91px',
      },
      fontSize: {
        'fontSize28' : '28px',
        'fontSize20' : '20px',
        'fontSize17' : '17px',
        'fontSize61' : '61px',
        'fontSize32' : '32px',
        'fontSize48' : '48px',
        'fontSize24' : '24px',
        'fontSize16' : '16px',
        'fontSize12' : '12px',
      }
    },
  },
  plugins: [],
}

