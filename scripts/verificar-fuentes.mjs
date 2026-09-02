#!/usr/bin/env node
/**
 * Verificador de tildes — Consejería Escolar
 * ==========================================
 *
 *   node scripts/verificar-fuentes.mjs
 *
 * Descarga cada fuente candidata de Google Fonts y le lee la tabla `cmap`
 * para comprobar, glifo por glifo, que trae TODO lo que el español necesita.
 *
 * Por qué no basta con mirar los "subsets" que declara Google
 * -----------------------------------------------------------
 * Es tentador filtrar por `latin-ext` y darlo por bueno. No sirve:
 * las tildes del español (á é í ó ú ü ñ) y los signos de apertura (¿ ¡)
 * viven en el rango `latin` (U+00A0–U+00FF), no en `latin-ext`
 * (U+0100–U+024F). Una fuente puede declarar `latin` y aun así no dibujar
 * la Ñ mayúscula — pasa mucho en las tipografías manuscritas, que se diseñan
 * en inglés y nunca se prueban en español.
 *
 * La única respuesta fiable es abrir el archivo y mirar. Eso hace esto.
 *
 * Correr esto ANTES de comprometerse con una fuente decorativa. Descubrir
 * que la Ñ sale como un rectángulo vacío después de maquetar la plantilla
 * es una tarde perdida.
 */

const FAMILIAS = [
  'Source Serif 4',
  'Source Sans 3',
  'Playfair Display',
  'Libre Baskerville',
  'Caveat',
  'Patrick Hand',
  'Shantell Sans',
  'Gochi Hand',
];

/** Todo lo que el español necesita y el inglés no. */
const REQUERIDOS = [
  ['á', 0x00e1],
  ['é', 0x00e9],
  ['í', 0x00ed],
  ['ó', 0x00f3],
  ['ú', 0x00fa],
  ['ü', 0x00fc],
  ['ñ', 0x00f1],
  ['Á', 0x00c1],
  ['É', 0x00c9],
  ['Í', 0x00cd],
  ['Ó', 0x00d3],
  ['Ú', 0x00da],
  ['Ü', 0x00dc],
  ['Ñ', 0x00d1],
  ['¿', 0x00bf],
  ['¡', 0x00a1],
];

// Google decide el formato según el User-Agent. Al revés de lo que uno
// esperaría: mandar un navegador antiguo devuelve una URL sin extensión
// (`/l/font?kit=...`), mientras que NO mandar User-Agent devuelve un `.ttf`
// limpio. Nos conviene el TTF: el WOFF2 va comprimido con Brotli sobre una
// estructura propia y habría que descomprimirlo antes de leer nada.
async function urlDeFuente(familia) {
  const url =
    'https://fonts.googleapis.com/css2?family=' +
    encodeURIComponent(familia).replace(/%20/g, '+');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSS ${res.status}`);
  const css = await res.text();
  const m = css.match(/url\((https:\/\/[^)]+)\)/);
  if (!m) throw new Error('sin fuente en el CSS');
  return m[1];
}

/** Lee la tabla cmap y devuelve el conjunto de codepoints con glifo real. */
function codepointsDe(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const numTablas = dv.getUint16(4);

  let cmapOff = null;
  for (let i = 0; i < numTablas; i++) {
    const rec = 12 + i * 16;
    const tag = String.fromCharCode(
      buf[rec],
      buf[rec + 1],
      buf[rec + 2],
      buf[rec + 3],
    );
    if (tag === 'cmap') cmapOff = dv.getUint32(rec + 8);
  }
  if (cmapOff === null) throw new Error('sin tabla cmap');

  // Escoger la mejor subtabla: Unicode BMP (3,1) o Unicode completo (3,10).
  const numSub = dv.getUint16(cmapOff + 2);
  let mejor = null;
  let mejorPuntaje = -1;
  for (let i = 0; i < numSub; i++) {
    const rec = cmapOff + 4 + i * 8;
    const plataforma = dv.getUint16(rec);
    const encoding = dv.getUint16(rec + 2);
    const off = cmapOff + dv.getUint32(rec + 4);
    let puntaje = -1;
    if (plataforma === 3 && encoding === 10) puntaje = 3;
    else if (plataforma === 3 && encoding === 1) puntaje = 2;
    else if (plataforma === 0) puntaje = 1;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = off;
    }
  }
  if (mejor === null) throw new Error('sin subtabla unicode');

  const cps = new Set();
  const formato = dv.getUint16(mejor);

  if (formato === 4) {
    const segX2 = dv.getUint16(mejor + 6);
    const seg = segX2 / 2;
    const finOff = mejor + 14;
    const inicioOff = finOff + segX2 + 2;
    const deltaOff = inicioOff + segX2;
    const rangoOff = deltaOff + segX2;

    for (let s = 0; s < seg; s++) {
      const fin = dv.getUint16(finOff + s * 2);
      const inicio = dv.getUint16(inicioOff + s * 2);
      const delta = dv.getInt16(deltaOff + s * 2);
      const rango = dv.getUint16(rangoOff + s * 2);
      if (inicio === 0xffff) continue;

      for (let c = inicio; c <= fin && c !== 0x10000; c++) {
        let glifo;
        if (rango === 0) {
          glifo = (c + delta) & 0xffff;
        } else {
          const p = rangoOff + s * 2 + rango + (c - inicio) * 2;
          if (p + 1 >= buf.byteLength) continue;
          glifo = dv.getUint16(p);
          if (glifo !== 0) glifo = (glifo + delta) & 0xffff;
        }
        if (glifo !== 0) cps.add(c);
      }
    }
  } else if (formato === 12) {
    const nGrupos = dv.getUint32(mejor + 12);
    for (let g = 0; g < nGrupos; g++) {
      const rec = mejor + 16 + g * 12;
      const inicio = dv.getUint32(rec);
      const fin = dv.getUint32(rec + 4);
      const glifo = dv.getUint32(rec + 8);
      if (glifo === 0) continue;
      for (let c = inicio; c <= fin; c++) cps.add(c);
    }
  } else {
    throw new Error(`formato cmap ${formato} no soportado`);
  }

  return cps;
}

const resultados = [];

for (const familia of FAMILIAS) {
  try {
    const url = await urlDeFuente(familia);
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const cps = codepointsDe(buf);
    const faltan = REQUERIDOS.filter(([, cp]) => !cps.has(cp)).map(
      ([ch]) => ch,
    );
    resultados.push({ familia, faltan, glifos: cps.size, error: null });
  } catch (e) {
    resultados.push({ familia, faltan: null, glifos: 0, error: e.message });
  }
}

console.log('\n  Verificación de tildes — ¿Cómo estás, Señor Núñez? ¡ÁÉÍÓÚ!\n');
console.log(
  '  ' + 'familia'.padEnd(20) + 'glifos'.padStart(7) + '   resultado',
);
console.log('  ' + '-'.repeat(62));

let fallos = 0;
for (const r of resultados) {
  let estado;
  if (r.error) {
    estado = `ERROR: ${r.error}`;
    fallos++;
  } else if (r.faltan.length === 0) {
    estado = 'completa';
  } else {
    estado = `FALTAN: ${r.faltan.join(' ')}`;
    fallos++;
  }
  console.log(
    '  ' + r.familia.padEnd(20) + String(r.glifos).padStart(7) + '   ' + estado,
  );
}

console.log('');
if (fallos > 0) {
  console.log(`  ${fallos} fuente(s) no sirven para español. No las uses.\n`);
  process.exit(1);
}
console.log('  Todas las fuentes cubren el español.\n');
