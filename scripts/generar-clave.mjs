#!/usr/bin/env node
/**
 * Genera las dos variables de entorno que necesita el panel.
 *
 *   node scripts/generar-clave.mjs "la contraseña que quieras"
 *
 * La contraseña NO se guarda en ningún sitio: lo que se imprime es un hash
 * scrypt con sal, que sirve para comprobarla pero no para recuperarla. Si se
 * pierde, se genera otra y ya está.
 */

import { randomBytes, scryptSync } from 'node:crypto';

const clave = process.argv[2];

if (!clave) {
  console.log(`
  Uso:  node scripts/generar-clave.mjs "tu contraseña"

  Consejo: tres o cuatro palabras corrientes con espacios se recuerdan mucho
  mejor que "Xk9#pL2!" y son más difíciles de adivinar por ser más largas.
  Por ejemplo:  "mesa verde catorce lápiz"
`);
  process.exit(1);
}

if (clave.length < 12) {
  console.log(`
  Esa contraseña tiene ${clave.length} caracteres. Son pocos.

  El panel limita los intentos, así que no hace falta que sea rara — pero sí
  que sea larga. Prueba con una frase de doce caracteres o más.
`);
  process.exit(1);
}

const sal = randomBytes(16);
const hash = scryptSync(clave, sal, 64);

console.log(`
  Pega estas dos líneas en .env.local (y en Vercel para producción):

SESSION_SECRET=${randomBytes(32).toString('hex')}
ADMIN_PASSWORD_HASH=scrypt:${sal.toString('hex')}:${hash.toString('hex')}

  Opcional — el nombre que sale en "Editado por…":

ADMIN_NOMBRE=Sra. Rivera

  Dos avisos:
  · Cambiar ADMIN_PASSWORD_HASH cierra las sesiones abiertas. Es a propósito.
  · Cambiar SESSION_SECRET también. No lo toques sin querer.
`);
