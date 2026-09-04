#!/usr/bin/env node
/**
 * Genera las dos variables de entorno que necesita el panel.
 *
 *   node scripts/generar-clave.mjs
 *
 * La contraseña NO se guarda en ningún sitio: lo que se imprime es un hash
 * scrypt con sal, que sirve para comprobarla pero no para recuperarla. Si se
 * pierde, se genera otra y ya está.
 *
 * ── POR QUÉ AHORA LA PIDE POR TECLADO Y NO COMO ARGUMENTO ────────────────
 *
 * Antes se usaba así:  node scripts/generar-clave.mjs "mi contraseña"
 *
 * Y eso tiene una trampa que no se ve: el intérprete de comandos procesa la
 * cadena ANTES de que node la reciba. PowerShell sustituye `$loquesea` por el
 * valor de esa variable —casi siempre por nada—, y bash hace lo mismo con `$`
 * y con los acentos graves. Una contraseña con un `$` producía un hash de un
 * texto DISTINTO del que la persona creía haber escrito, y luego el panel
 * decía "contraseña incorrecta" para siempre sin explicar nada.
 *
 * Pidiéndola por teclado, el intérprete no la toca nunca.
 */

import { createInterface } from 'node:readline';
import { randomBytes, scryptSync } from 'node:crypto';

const MINIMO = 12;

function generar(clave) {
  if (clave.length < MINIMO) {
    console.log(`
  Esa contraseña tiene ${clave.length} caracteres. Son pocos.

  El panel limita los intentos a diez cada cuarto de hora, así que no hace
  falta que sea rara — pero sí que sea larga. Tres o cuatro palabras
  corrientes con espacios se recuerdan mucho mejor que "Xk9#pL2!" y son más
  difíciles de adivinar por ser más largas.

  Por ejemplo:  salon doce ventana grande
`);
    process.exit(1);
  }

  const sal = randomBytes(16);
  const hash = scryptSync(clave, sal, 64);

  console.log(`
  Pega estas dos líneas en .env.local (y en Vercel para producción):

CONSEJERIA_SESSION_SECRET=${randomBytes(32).toString('hex')}
CONSEJERIA_ADMIN_PASSWORD_HASH=scrypt:${sal.toString('hex')}:${hash.toString('hex')}

  Opcional — el nombre que sale en "Editado por…" y en cada commit:

CONSEJERIA_ADMIN_NOMBRE=Sra. Rivera

  Tres avisos:
  · En Vercel, cambiar una variable NO afecta a los despliegues que ya
    existen. Hay que VOLVER A DESPLEGAR para que el cambio entre.
  · Cambiar CONSEJERIA_ADMIN_PASSWORD_HASH cierra las sesiones abiertas. Es a propósito.
  · Cambiar CONSEJERIA_SESSION_SECRET también. No lo toques sin querer.

  Para comprobar después que la contraseña y el hash casan:
    node scripts/comprobar-clave.mjs
`);
}

const deArgumento = process.argv[2];

if (deArgumento) {
  console.log(`
  AVISO: has pasado la contraseña como argumento.

  Si lleva $ , comilla, acento grave o ! , el intérprete de comandos ya la ha
  cambiado y el hash NO va a corresponder a lo que tú escribes en el panel.
  Si la contraseña es solo letras, números y espacios, no pasa nada.

  Para evitarlo del todo, ejecuta el comando SIN argumento.
`);
  generar(deArgumento);
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question('  Escribe la contraseña del panel y pulsa Enter: ', (clave) => {
    rl.close();
    generar(clave);
  });
}
