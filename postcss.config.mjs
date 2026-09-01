/** Tailwind v4 se conecta como plugin de PostCSS.
 *  La configuración de temas ya no vive aquí ni en tailwind.config.js:
 *  va en CSS, dentro de `@theme` en app/globals.css. */
const config = {
  plugins: ['@tailwindcss/postcss'],
};

export default config;
