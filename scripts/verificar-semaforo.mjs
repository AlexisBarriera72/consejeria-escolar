#!/usr/bin/env node
/**
 * Pruebas del Semáforo de Accesibilidad
 *
 *   node scripts/verificar-semaforo.mjs
 *
 * Importa lo que corre de verdad, no una copia. Si alguien cambia una regla
 * y se le olvida el efecto, esto lo dice.
 */

import assert from 'node:assert/strict';
import { revisar, puedePublicar } from '../lib/semaforo.ts';

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

const bien = {
  titulo: 'Cómo pedir una cita',
  cuerpoHtml: '<p>Pasa por el salón 12.</p>',
};

console.log('\n  Semáforo de Accesibilidad\n');

prueba('un anuncio correcto no da avisos', () => {
  assert.deepEqual(revisar(bien), []);
  assert.ok(puedePublicar(revisar(bien)));
});

prueba('una foto sin descripción BLOQUEA', () => {
  const h = revisar({ ...bien, tieneImagen: true, imagenAlt: '' });
  assert.equal(h[0].nivel, 'rojo');
  assert.match(h[0].mensaje, /Qué se ve/);
  assert.ok(!puedePublicar(h), 'no debería dejar publicar');
});

prueba('una foto CON descripción pasa', () => {
  const h = revisar({
    ...bien,
    tieneImagen: true,
    imagenAlt: 'Estudiantes en la biblioteca',
  });
  assert.deepEqual(h, []);
});

prueba('el cuerpo vacío bloquea', () => {
  assert.ok(!puedePublicar(revisar({ titulo: 'Algo', cuerpoHtml: '<p></p>' })));
});

prueba('el título vacío bloquea', () => {
  assert.ok(
    !puedePublicar(revisar({ titulo: '  ', cuerpoHtml: '<p>Hola</p>' })),
  );
});

prueba('un título largo avisa pero deja publicar', () => {
  const h = revisar({ ...bien, titulo: 'A'.repeat(90) });
  assert.equal(h[0].nivel, 'amarillo');
  assert.ok(puedePublicar(h));
});

prueba('MAYÚSCULAS SOSTENIDAS avisan', () => {
  const h = revisar({ ...bien, titulo: 'IMPORTANTE AVISO' });
  assert.ok(h.some((x) => /deletrean/.test(x.mensaje)));
});

prueba(
  'acepta título normal con acentos sin confundirlo con mayúsculas',
  () => {
    const h = revisar({ ...bien, titulo: 'Información sobre becas' });
    assert.deepEqual(h, []);
  },
);

prueba('un enlace que dice "aquí" avisa', () => {
  const h = revisar({
    ...bien,
    cuerpoHtml: '<p>Míralo <a href="/x">aquí</a>.</p>',
  });
  assert.ok(h.some((x) => /aquí/.test(x.mensaje)));
  assert.ok(puedePublicar(h), 'debe avisar, no bloquear');
});

prueba('un enlace con texto descriptivo no avisa', () => {
  const h = revisar({
    ...bien,
    cuerpoHtml: '<p>Lee los <a href="/x">requisitos de graduación</a>.</p>',
  });
  assert.deepEqual(h, []);
});

prueba('un enlace sin texto bloquea', () => {
  const h = revisar({ ...bien, cuerpoHtml: '<p><a href="/x"></a></p>' });
  assert.ok(!puedePublicar(h));
});

prueba('avisa de los PDF no accesibles', () => {
  const h = revisar({ ...bien, adjuntosNoAccesibles: 2 });
  assert.ok(h.some((x) => /lector de pantalla/.test(x.mensaje)));
});

console.log(`\n  ${pasadas} prueba(s) pasadas.\n`);
