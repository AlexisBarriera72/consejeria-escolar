#!/usr/bin/env node
/**
 * Pruebas de la búsqueda — Consejería Escolar
 *
 *   node scripts/verificar-busqueda.mjs
 *
 * El caso que de verdad importa es el de las tildes. Casi nadie escribe
 * "matrícula" con tilde en un buscador, y menos desde un teléfono. Si la
 * búsqueda no las ignora, la persona no piensa "me faltó la tilde": piensa
 * "aquí no hay nada" y se va.
 *
 * Y la ñ tiene que sobrevivir: "año" y "ano" son palabras distintas, y
 * confundirlas en un sitio escolar sería memorable por el motivo equivocado.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coincide, normalizar, soloTexto } from '../lib/busqueda.ts';

let pasadas = 0;
const prueba = (nombre, fn) => {
  try {
    fn();
    pasadas++;
    console.log(`  ✓ ${nombre}`);
  } catch (e) {
    console.log(`  ✗ ${nombre}\n      ${e.message}`);
    process.exitCode = 1;
  }
};

console.log('\n  Búsqueda\n');

prueba('quita las tildes', () => {
  assert.equal(normalizar('Matrícula'), 'matricula');
  assert.equal(normalizar('ANSIEDAD'), 'ansiedad');
  assert.equal(normalizar('Vocación'), 'vocacion');
  assert.equal(normalizar('ÁÉÍÓÚ'), 'aeiou');
});

prueba('quita la diéresis', () => {
  assert.equal(normalizar('vergüenza'), 'verguenza');
});

prueba('CONSERVA la ñ', () => {
  assert.equal(normalizar('Año'), 'año');
  assert.equal(normalizar('Núñez'), 'nuñez');
  // Si esto fallara, "año" y "ano" serían la misma palabra.
  assert.notEqual(normalizar('año'), normalizar('ano'));
});

prueba('encuentra escribiendo sin tildes', () => {
  assert.ok(coincide('matricula', '¿Cómo hago la matrícula?'));
  assert.ok(coincide('graduacion', 'Requisitos de graduación'));
});

prueba('encuentra escribiendo con tildes texto sin ellas', () => {
  assert.ok(coincide('matrícula', 'Como hago la matricula'));
});

prueba('exige todas las palabras, en cualquier orden', () => {
  assert.ok(coincide('beca universidad', 'Universidad: cómo pedir una beca'));
  assert.ok(!coincide('beca deporte', 'Universidad: cómo pedir una beca'));
});

prueba('una consulta vacía no filtra nada', () => {
  assert.ok(coincide('', 'lo que sea'));
  assert.ok(coincide('   ', 'lo que sea'));
});

prueba('busca también dentro de la respuesta', () => {
  const html = '<p>Habla con la <strong>consejera</strong> en el salón 12.</p>';
  assert.ok(coincide('salon 12', 'Título cualquiera', soloTexto(html)));
});

prueba('soloTexto quita las etiquetas', () => {
  assert.equal(soloTexto('<p>Hola <strong>mundo</strong></p>'), 'Hola mundo');
  assert.equal(soloTexto('<ul><li>uno</li><li>dos</li></ul>'), 'uno dos');
});

prueba('la semilla real es buscable', () => {
  const preguntas = JSON.parse(readFileSync('contenido/preguntas.json', 'utf8'));
  const hallados = preguntas.filter((p) =>
    coincide('lorem', p.pregunta, soloTexto(p.respuesta)),
  );
  assert.equal(hallados.length, preguntas.length);
  assert.equal(
    preguntas.filter((p) => coincide('zzzzz', p.pregunta)).length,
    0,
  );
});

console.log(`\n  ${pasadas} prueba(s) pasadas.\n`);
