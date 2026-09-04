#!/usr/bin/env node
/**
 * ¿Coincide esta contraseña con el hash guardado?
 *
 *   node scripts/comprobar-clave.mjs
 *
 * Existe para separar dos preguntas que desde el panel se ven igual, porque
 * el 401 de /api/acceso es el mismo en los dos casos a propósito:
 *
 *   a) el hash no corresponde a la contraseña que escribes, o
 *   b) el hash es correcto pero el servidor no lo está leyendo.
 *
 * Si aquí sale que coincide y el panel sigue diciendo que no, el problema NO
 * es la contraseña: es de dónde lee las variables el servidor.
 *
 * Pide la contraseña por teclado y NO por argumento a propósito. Ver la nota
 * larga sobre el intérprete de comandos más abajo.
 */

import { createInterface } from 'node:readline';
import { readFileSync, existsSync } from 'node:fs';
import { scryptSync, timingSafeEqual } from 'node:crypto';

function hashGuardado() {
  // Primero la variable del entorno; si no, el .env.local del proyecto.
  if (process.env.CONSEJERIA_ADMIN_PASSWORD_HASH)
    return process.env.CONSEJERIA_ADMIN_PASSWORD_HASH;
  if (!existsSync('.env.local')) return null;
  for (const linea of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const i = linea.indexOf('=');
    if (
      i > 0 &&
      linea.slice(0, i).trim() === 'CONSEJERIA_ADMIN_PASSWORD_HASH'
    ) {
      return linea.slice(i + 1).trim();
    }
  }
  return null;
}

const crudo = hashGuardado();

if (!crudo) {
  console.log(`
  No encuentro CONSEJERIA_ADMIN_PASSWORD_HASH ni en el entorno ni en .env.local.
`);
  process.exit(1);
}

const partes = crudo.split(':');
console.log(`
  Hash encontrado
    formato   ${partes.length === 3 && partes[0] === 'scrypt' ? 'correcto (scrypt:sal:hash)' : 'INCORRECTO — deberia ser scrypt:sal:hash'}
    longitud  ${crudo.length} caracteres ${crudo.length === 168 ? '(la esperada)' : '— se esperaban 168, puede estar cortado'}
`);

if (partes.length !== 3 || partes[0] !== 'scrypt') process.exit(1);

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question('  Escribe la contraseña y pulsa Enter: ', (clave) => {
  rl.close();

  const sal = Buffer.from(partes[1], 'hex');
  const esperado = Buffer.from(partes[2], 'hex');
  const intento = scryptSync(clave, sal, esperado.length);
  const coincide =
    intento.length === esperado.length && timingSafeEqual(intento, esperado);

  console.log(
    coincide
      ? `
  ✓ COINCIDE.

  Entonces la contraseña es correcta y el problema está en otro sitio:

   · En Vercel, cambiar una variable NO afecta a los despliegues que ya
     existen. Hay que volver a desplegar para que el cambio entre.
   · En local, si el servidor de desarrollo llevaba abierto desde antes del
     cambio, párala y arráncala otra vez.
`
      : `
  ✗ NO COINCIDE. El hash guardado no corresponde a esa contraseña.

  La causa más probable, y es culpa de cómo se generó:

  Si generaste el hash con  generar-clave.mjs "tu contraseña"  y la contraseña
  llevaba $ , comilla, acento grave o ! , el intérprete de comandos la cambió
  ANTES de que node la viera. PowerShell sustituye $loquesea por el valor de
  esa variable —normalmente por nada—, y bash hace lo mismo con $ y con los
  acentos graves. O sea: el hash se calculó sobre un texto distinto del que
  tú creías escribir, y por eso nunca va a coincidir.

  Vuelve a generarlo con  node scripts/generar-clave.mjs  SIN argumento: así
  la pide por teclado y el intérprete no la toca.
`,
  );
  process.exit(coincide ? 0 : 1);
});
