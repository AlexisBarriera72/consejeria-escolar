#!/usr/bin/env node
/**
 * Verificador de contenido — Consejería Escolar
 * =============================================
 *
 *   node scripts/verificar-contenido.mjs
 *
 * Comprueba la forma de los datos y, sobre todo, la INTEGRIDAD REFERENCIAL:
 * que ninguna guía apunte a una categoría que no existe, que ningún anuncio
 * tenga de autor a alguien borrado, que ningún "trabaja con" señale al vacío.
 *
 * TypeScript no puede atrapar nada de esto: los JSON entran con un `as` y a
 * partir de ahí el compilador se cree lo que le digan. Estos errores solo
 * aparecen en tiempo de ejecución, normalmente como una página en blanco.
 *
 * En la Sección 11 este mismo archivo pasa a correr sobre lo que llega de
 * GitHub, que es cuando de verdad hace falta: ahí los datos los escriben
 * personas, no un generador.
 */

import { readFileSync } from 'node:fs';

const leer = (n) => JSON.parse(readFileSync(`contenido/${n}.json`, 'utf8'));

const categorias = leer('categorias');
const preguntas = leer('preguntas');
const noticias = leer('noticias');
const perfiles = leer('perfiles');
const aviso = leer('aviso');

const ACENTOS = [
  'azul',
  'turquesa',
  'menta',
  'rosa',
  'coral',
  'naranja',
  'ambar',
  'salvia',
];
const PLANTILLAS = [
  'periodico',
  'blog',
  'notita',
  'corcho',
  'comunicado',
  'afiche',
  'pizarra',
  'urgente',
];
const ESTADOS = ['borrador', 'publicado'];

const errores = [];
const fallo = (donde, msg) => errores.push(`${donde}: ${msg}`);

const esTexto = (v) => typeof v === 'string' && v.length > 0;
const esFecha = (v) => esTexto(v) && !Number.isNaN(Date.parse(v));

function revisarBase(x, donde) {
  if (!esTexto(x.id)) fallo(donde, 'id vacío o ausente');
  if (!ESTADOS.includes(x.estado)) fallo(donde, `estado inválido: ${x.estado}`);
  if (x.locale !== 'es') fallo(donde, `locale inválido: ${x.locale}`);
  if (!esFecha(x.creadoEn)) fallo(donde, 'creadoEn no es una fecha');
  if (!esFecha(x.actualizadoEn)) fallo(donde, 'actualizadoEn no es una fecha');
  if (x.eliminadoEn !== null && !esFecha(x.eliminadoEn))
    fallo(donde, 'eliminadoEn debe ser null o una fecha');
}

function revisarUnicos(lista, campo, nombre) {
  const vistos = new Set();
  for (const x of lista) {
    const v = x[campo];
    if (vistos.has(v)) fallo(nombre, `${campo} repetido: ${v}`);
    vistos.add(v);
  }
}

// ── Categorías ─────────────────────────────────────────────────────────────
for (const c of categorias) {
  const d = `categoria ${c.id}`;
  revisarBase(c, d);
  if (!esTexto(c.titulo)) fallo(d, 'titulo vacío');
  if (!ACENTOS.includes(c.acento)) fallo(d, `acento inválido: ${c.acento}`);
  if (typeof c.orden !== 'number') fallo(d, 'orden no es número');
}
revisarUnicos(categorias, 'id', 'categorias');

// ── Perfiles ───────────────────────────────────────────────────────────────
const idsPerfil = new Set(perfiles.map((p) => p.id));
for (const p of perfiles) {
  const d = `perfil ${p.id}`;
  revisarBase(p, d);
  if (!esTexto(p.nombre)) fallo(d, 'nombre vacío');
  if (!esTexto(p.slug)) fallo(d, 'slug vacío');
  if (!esTexto(p.puesto)) fallo(d, 'puesto vacío');
  if (!ACENTOS.includes(p.acento)) fallo(d, `acento inválido: ${p.acento}`);
  if (!Array.isArray(p.credenciales)) fallo(d, 'credenciales no es lista');
  if (p.foto && !esTexto(p.foto.alt))
    fallo(d, 'la foto no tiene descripción (alt)');
  for (const otro of p.trabajaCon) {
    if (!idsPerfil.has(otro))
      fallo(d, `trabajaCon apunta a "${otro}", que no existe`);
    if (otro === p.id) fallo(d, 'trabajaCon se apunta a sí mismo');
  }
}
revisarUnicos(perfiles, 'id', 'perfiles');
revisarUnicos(perfiles, 'slug', 'perfiles');

// ── Preguntas ──────────────────────────────────────────────────────────────
const idsCategoria = new Set(categorias.map((c) => c.id));
for (const q of preguntas) {
  const d = `pregunta ${q.id}`;
  revisarBase(q, d);
  if (!esTexto(q.pregunta)) fallo(d, 'pregunta vacía');
  if (!esTexto(q.slug)) fallo(d, 'slug vacío');
  if (!idsCategoria.has(q.categoriaId))
    fallo(d, `categoriaId "${q.categoriaId}" no existe`);
  for (const r of q.responsables) {
    if (!idsPerfil.has(r)) fallo(d, `responsable "${r}" no existe`);
  }
  if (q.video) {
    if (!esTexto(q.video.url)) fallo(d, 'el video no tiene url');
    // Un video propio sin subtítulos es un fallo de WCAG 1.2.2. YouTube al
    // menos tiene automáticos que alguien puede corregir; un mp4 nuestro no
    // tiene nada.
    if (q.video.tipo === 'archivo' && !esTexto(q.video.subtitulosUrl))
      fallo(d, 'video propio sin subtítulos (.vtt)');
  }
  for (const a of q.adjuntos) {
    if (!esTexto(a.nombre)) fallo(d, 'adjunto sin nombre');
    if (typeof a.esAccesible !== 'boolean')
      fallo(d, 'adjunto sin marcar si es accesible');
  }
}
revisarUnicos(preguntas, 'id', 'preguntas');
revisarUnicos(preguntas, 'slug', 'preguntas');

// ── Noticias ───────────────────────────────────────────────────────────────
for (const a of noticias) {
  const d = `anuncio ${a.id}`;
  revisarBase(a, d);
  if (!esTexto(a.titulo)) fallo(d, 'titulo vacío');
  if (!esTexto(a.slug)) fallo(d, 'slug vacío');
  if (!PLANTILLAS.includes(a.plantilla))
    fallo(d, `plantilla inválida: ${a.plantilla}`);
  if (!esFecha(a.publicarEn)) fallo(d, 'publicarEn no es una fecha');
  if (a.expiraEn !== null && !esFecha(a.expiraEn))
    fallo(d, 'expiraEn debe ser null o una fecha');
  if (a.expiraEn && new Date(a.expiraEn) <= new Date(a.publicarEn))
    fallo(d, 'expiraEn es anterior o igual a publicarEn');
  if (a.autorPerfilId !== null && !idsPerfil.has(a.autorPerfilId))
    fallo(d, `autorPerfilId "${a.autorPerfilId}" no existe`);
  if (a.imagen && !esTexto(a.imagen.alt))
    fallo(d, 'la imagen no tiene descripción (alt)');
  if (a.titulo.length > 70)
    fallo(
      d,
      `titulo de ${a.titulo.length} caracteres — se corta en el celular`,
    );
}
revisarUnicos(noticias, 'id', 'noticias');
revisarUnicos(noticias, 'slug', 'noticias');

const destacadas = noticias.filter((a) => a.destacado);
if (destacadas.length > 1)
  fallo(
    'noticias',
    `${destacadas.length} anuncios destacados; debe haber 0 o 1`,
  );

// ── Aviso ──────────────────────────────────────────────────────────────────
if (typeof aviso.activo !== 'boolean') fallo('aviso', 'activo no es booleano');
if (!['info', 'urgente'].includes(aviso.nivel))
  fallo('aviso', `nivel inválido: ${aviso.nivel}`);
if (aviso.activo && !esTexto(aviso.mensaje))
  fallo('aviso', 'está activo pero el mensaje está vacío');

// ── Resultado ──────────────────────────────────────────────────────────────
console.log('\n  Verificación de contenido\n');
console.log(`  categorías  ${String(categorias.length).padStart(3)}`);
console.log(`  preguntas   ${String(preguntas.length).padStart(3)}`);
console.log(`  noticias    ${String(noticias.length).padStart(3)}`);
console.log(`  perfiles    ${String(perfiles.length).padStart(3)}`);

if (errores.length > 0) {
  console.log(`\n  ${errores.length} problema(s):\n`);
  for (const e of errores) console.log(`    · ${e}`);
  console.log('');
  process.exit(1);
}
console.log('\n  Sin problemas. Referencias íntegras.\n');
