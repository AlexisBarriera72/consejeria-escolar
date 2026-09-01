#!/usr/bin/env node
/**
 * Pruebas de conRelacionesMutuas() — Consejería Escolar
 * =====================================================
 *
 *   node scripts/verificar-mutuos.mjs
 *
 * Node 24 lee TypeScript directamente (le quita los tipos y lo ejecuta), así
 * que se puede importar el módulo real sin compilar nada ni instalar un
 * framework de pruebas. Por eso lib/mutuos.ts es una función pura sin
 * importaciones: para poder probarla así de fácil.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { conRelacionesMutuas } from '../lib/mutuos.ts';

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

const ordenar = (xs) => [...xs].sort();

console.log('\n  conRelacionesMutuas()\n');

prueba('una relación en un solo sentido se vuelve mutua', () => {
  const r = conRelacionesMutuas([
    { id: 'a', trabajaCon: ['b'] },
    { id: 'b', trabajaCon: [] },
  ]);
  assert.deepEqual(r[0].trabajaCon, ['b']);
  assert.deepEqual(r[1].trabajaCon, ['a'], 'b debería listar a a');
});

prueba('una relación ya mutua no se duplica', () => {
  const r = conRelacionesMutuas([
    { id: 'a', trabajaCon: ['b'] },
    { id: 'b', trabajaCon: ['a'] },
  ]);
  assert.deepEqual(r[0].trabajaCon, ['b']);
  assert.deepEqual(r[1].trabajaCon, ['a']);
});

prueba('se descartan las referencias a alguien que no existe', () => {
  const r = conRelacionesMutuas([{ id: 'a', trabajaCon: ['fantasma'] }]);
  assert.deepEqual(r[0].trabajaCon, []);
});

prueba('se descarta apuntarse a uno mismo', () => {
  const r = conRelacionesMutuas([{ id: 'a', trabajaCon: ['a'] }]);
  assert.deepEqual(r[0].trabajaCon, []);
});

prueba('no muta la lista original', () => {
  const original = [
    { id: 'a', trabajaCon: ['b'] },
    { id: 'b', trabajaCon: [] },
  ];
  conRelacionesMutuas(original);
  assert.deepEqual(original[1].trabajaCon, [], 'la entrada fue modificada');
});

prueba('conserva los demás campos', () => {
  const r = conRelacionesMutuas([{ id: 'a', nombre: 'María', trabajaCon: [] }]);
  assert.equal(r[0].nombre, 'María');
});

prueba('la semilla real queda simétrica', () => {
  const perfiles = JSON.parse(readFileSync('contenido/perfiles.json', 'utf8'));

  // La semilla es asimétrica a propósito: p-rivera lista a p-santos pero
  // p-santos no lista a nadie, y p-mendez lista a p-colon sin reciprocidad.
  const antes = new Map(perfiles.map((p) => [p.id, p.trabajaCon]));
  assert.ok(
    antes.get('p-rivera').includes('p-santos') &&
      !antes.get('p-santos').includes('p-rivera'),
    'la semilla dejó de ser asimétrica; la prueba ya no comprueba nada',
  );

  const despues = new Map(
    conRelacionesMutuas(perfiles).map((p) => [p.id, p.trabajaCon]),
  );

  for (const [id, conexiones] of despues) {
    for (const otro of conexiones) {
      assert.ok(
        despues.get(otro).includes(id),
        `${otro} no devuelve la relación con ${id}`,
      );
    }
  }

  assert.deepEqual(ordenar(despues.get('p-santos')), ['p-rivera']);
  assert.deepEqual(ordenar(despues.get('p-colon')), ['p-mendez', 'p-rivera']);
});

console.log(`\n  ${pasadas} prueba(s) pasadas.\n`);
