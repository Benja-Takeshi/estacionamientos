/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // LOS 3 COLORES DE LA APP (tus mismos nombres: primary, secondary, tertiary)
      // Si cambias uno aquí, cámbialo también en constants/colores.ts
      colors: {
        primary: '#002168',   // azul: títulos, botones, estado "Reservado"
        secondary: '#12A44A', // verde: estado "Libre" y condición "Buena"
        tertiary: '#C4161C',  // rojo: estado "Ocupado", condición "Mala", borrar y errores
      },

      // LA ÚNICA FUENTE DE LA APP: Work Sans (con sus 3 grosores)
      fontFamily: {
        'work-black': ['WorkSans-Black', 'sans-serif'],
        'work-bold': ['WorkSans-Bold', 'sans-serif'],
        'work-medium': ['WorkSans-Medium', 'sans-serif'],
        'work-light': ['WorkSans-Light', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
