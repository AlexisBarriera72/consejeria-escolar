// eslint-config-next 16 exporta configuraciones "flat" nativas, así que no
// hace falta el puente FlatCompat de @eslint/eslintrc. Pasarlas por FlatCompat
// además falla: el esquema no valida.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  {
    // El demo de acceso es Node puro y a propósito no usa el resto del
    // proyecto. No tiene que cumplir las reglas de React.
    ignores: ['.next/**', 'node_modules/**', 'demo/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
