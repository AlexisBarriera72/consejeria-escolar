#!/usr/bin/env node
/**
 * Auditoría de accesibilidad — Consejería Escolar
 * ===============================================
 *
 *   npm run build && node scripts/verificar-accesibilidad.mjs
 *
 * Pasa axe-core por CADA página ya construida en .next. Encuentra lo que un
 * humano no ve leyendo el código: encabezados que se saltan un nivel, ids
 * repetidos, imágenes sin describir, botones sin nombre accesible, aria mal
 * puesto, campos sin etiqueta.
 *
 * QUÉ NO CUBRE (y por qué está bien)
 * ----------------------------------
 * jsdom no calcula diseño ni estilos, así que axe no puede evaluar aquí el
 * contraste de color ni si algo está tapado. Eso NO es un hueco: el contraste
 * lo comprueba scripts/verificar-contraste.mjs sobre los tokens del diseño,
 * que es más fiable — mide la fuente en vez del resultado.
 *
 * Tampoco sustituye a probar con teclado y con lector de pantalla de verdad.
 * Las herramientas automáticas encuentran cerca de un tercio de los problemas
 * reales; el resto aparece usando el sitio. La lista de comprobación manual
 * está en docs/07-accesibilidad-legal.md §4.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const RAIZ = '.next/server/app';

/** Reglas que no aplican a un fragmento sin estilos ni navegador. */
const DESACTIVADAS = {
  'color-contrast': { enabled: false }, // ver verificar-contraste.mjs
  'meta-viewport': { enabled: false }, // el <head> lo inyecta Next aparte
};

/**
 * Páginas que NO son nuestras y no podemos arreglar desde el código.
 *
 * `_global-error.html` es la pantalla 500 estática que Next genera por su
 * cuenta. Renderiza su propio documento sin `lang` y sin landmarks, y no la
 * sustituye nuestro `app/global-error.tsx` — la documentación de Next lo dice
 * explícitamente: «global-error and the built-in 500 page render their own
 * document». Nuestro global-error.tsx SÍ se usa cuando el error ocurre de
 * verdad en tiempo de ejecución; este archivo es otra cosa.
 *
 * Se excluye a conciencia y dejando dicho por qué, en vez de bajar el listón
 * de toda la auditoría para que pase.
 */
const AJENAS = ['_global-error'];

function paginas(dir, encontradas = []) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) paginas(ruta, encontradas);
    else if (entrada.endsWith('.html')) encontradas.push(ruta);
  }
  return encontradas;
}

const archivos = paginas(RAIZ)
  .filter((f) => !AJENAS.some((a) => f.includes(a)))
  .sort();
if (archivos.length === 0) {
  console.log('\n  No hay páginas construidas. Corre `npm run build` antes.\n');
  process.exit(1);
}

console.log(`\n  Accesibilidad — ${archivos.length} páginas\n`);

let totalFallos = 0;
const porRegla = new Map();

for (const archivo of archivos) {
  const html = readFileSync(archivo, 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;

  // axe-core espera vivir dentro de una ventana.
  window.eval(axe.source);

  const resultado = await window.axe.run(window.document, {
    rules: DESACTIVADAS,
    resultTypes: ['violations'],
  });

  const ruta =
    '/' +
    archivo
      .replace(RAIZ, '')
      .replace(/\\/g, '/')
      .replace(/^\//, '')
      .replace(/\.html$/, '')
      .replace(/^index$/, '');

  if (resultado.violations.length === 0) {
    console.log(`  ✓ ${ruta}`);
  } else {
    console.log(`  ✗ ${ruta}`);
    for (const v of resultado.violations) {
      totalFallos += v.nodes.length;
      porRegla.set(v.id, (porRegla.get(v.id) ?? 0) + v.nodes.length);
      console.log(`      [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 2)) {
        console.log(`        ${n.html.slice(0, 110)}`);
      }
    }
  }
  window.close();
}

console.log('');
if (totalFallos > 0) {
  console.log(`  ${totalFallos} incumplimiento(s):`);
  for (const [regla, n] of [...porRegla].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(3)} × ${regla}`);
  }
  console.log('');
  process.exit(1);
}
console.log('  Sin incumplimientos automáticos.');
console.log(
  '  Falta la prueba manual: teclado y lector de pantalla (doc 07 §4).\n',
);
