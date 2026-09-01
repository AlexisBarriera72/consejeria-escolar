#!/usr/bin/env node
/**
 * Genera contenido/preguntas.json y contenido/noticias.json.
 *
 * Existe para que la semilla sea reproducible y no un montón de JSON escrito
 * a mano donde es facilísimo colar un id repetido o una fecha imposible.
 * Se vuelve a correr con:  node scripts/generar-semilla.mjs
 */

import { writeFileSync } from 'node:fs';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ' +
  'tempor incididunt ut labore et dolore magna aliqua.';
const LOREM2 =
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
  'ut aliquip ex ea commodo consequat. Duis aute irure dolor.';

const base = (id, fecha) => ({
  id,
  estado: 'publicado',
  locale: 'es',
  creadoEn: fecha,
  actualizadoEn: fecha,
  actualizadoPor: 'Sra. Rivera',
  eliminadoEn: null,
});

// ── Preguntas: 4 por categoría ─────────────────────────────────────────────

const CATS = [
  ['c-academico', 'aca', ['p-rivera']],
  ['c-personal', 'per', ['p-colon', 'p-rivera']],
  ['c-vocacional', 'voc', ['p-rivera', 'p-santos']],
];

const preguntas = [];
for (const [categoriaId, pre, responsables] of CATS) {
  for (let i = 1; i <= 4; i++) {
    const id = `q-${pre}-${i}`;
    // Dos preguntas llevan video, una lleva PDF. Así las páginas de la
    // Sección 7 tienen que manejar los tres casos desde el primer día.
    const conVideo = (pre === 'aca' && i === 1) || (pre === 'per' && i === 2);
    const conPdf = pre === 'voc' && i === 3;
    preguntas.push({
      ...base(id, `2026-08-0${i}T12:00:00.000Z`),
      categoriaId,
      slug: `${pre}-pregunta-${i}`,
      pregunta: `Lorem ipsum dolor sit amet ${pre} ${i}?`,
      respuesta: `<p>${LOREM}</p><p>${LOREM2}</p>`,
      video: conVideo
        ? {
            tipo: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            titulo: 'Lorem ipsum dolor sit amet',
            subtitulosUrl: null,
            duracionSeg: 212,
          }
        : null,
      adjuntos: conPdf
        ? [
            {
              url: '/adjuntos/lorem-ipsum.pdf',
              nombre: 'Lorem ipsum dolor.pdf',
              tipo: 'application/pdf',
              tamanoBytes: 184320,
              esAccesible: true,
            },
          ]
        : [],
      responsables,
      orden: i,
    });
  }
}

// ── Noticias: 8 anuncios, uno por plantilla ───────────────────────────────

const NOTICIAS = [
  ['a-1', 'periodico', '2026-09-01', '2026-11-01', true, null],
  ['a-2', 'afiche', '2026-08-20', '2026-09-16', false, '2026-09-15'],
  ['a-3', 'notita', '2026-08-05', '2026-10-05', false, null],
  ['a-4', 'comunicado', '2026-07-15', '2026-09-15', false, null],
  // Este ya venció: existe para comprobar que el filtro de expiración
  // funciona y que el archivo lo sigue mostrando.
  ['a-5', 'corcho', '2026-06-20', '2026-07-20', false, null],
  ['a-6', 'blog', '2026-06-05', null, false, null],
  ['a-7', 'pizarra', '2026-08-28', '2026-10-28', false, null],
  ['a-8', 'urgente', '2026-08-12', '2026-09-12', false, null],
];

const AUTORES = [
  'p-rivera',
  'p-colon',
  'p-santos',
  'p-rivera',
  null,
  'p-rivera',
  'p-mendez',
  'p-rivera',
];

const noticias = NOTICIAS.map(
  ([id, plantilla, publicarEn, expiraEn, destacado, fechaEvento], i) => ({
    ...base(id, `${publicarEn}T09:00:00.000Z`),
    slug: `${id}-lorem-ipsum-dolor-sit-amet`,
    plantilla,
    titulo: 'Lorem Ipsum Dolor Sit Amet',
    bajada: 'Consectetur adipiscing elit, sed do eiusmod tempor.',
    cuerpo: `<p>${LOREM}</p><p>${LOREM2}</p><p>${LOREM}</p>`,
    imagen: null,
    etiquetas: i % 2 === 0 ? ['Avisos'] : ['Eventos', 'Becas'],
    fechaEvento,
    horaTexto: fechaEvento ? 'Después del almuerzo' : null,
    lugar: fechaEvento ? 'Biblioteca' : null,
    autorPerfilId: AUTORES[i],
    destacado,
    publicarEn: `${publicarEn}T09:00:00.000Z`,
    expiraEn: expiraEn ? `${expiraEn}T23:59:59.000Z` : null,
  }),
);

const escribir = (archivo, datos) => {
  writeFileSync(`contenido/${archivo}`, JSON.stringify(datos, null, 2) + '\n');
  console.log(`  ${archivo.padEnd(18)} ${datos.length} registros`);
};

console.log('\n  Semilla generada:');
escribir('preguntas.json', preguntas);
escribir('noticias.json', noticias);
console.log('');
