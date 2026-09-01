#!/usr/bin/env node
/**
 * Verificador de contraste — Consejería Escolar
 * =============================================
 *
 *   node scripts/verificar-contraste.mjs
 *
 * Calcula el contraste real (WCAG 2.1) de cada combinación que el diseño
 * usa de verdad, y falla si alguna baja del mínimo.
 *
 * El punto de tener esto como script y no como tabla en un documento: una
 * tabla escrita a mano envejece en cuanto alguien ajusta un color "solo un
 * poquito". Esto se puede correr, y si alguien oscurece el azul en dos años
 * se entera en el momento.
 *
 * El caso que motivó el script: #4378c6 sobre blanco da 4.43. El mínimo AA
 * para texto normal es 4.5. Se queda corto por 0.07 — una diferencia que
 * nadie ve a ojo y que ningún revisor humano habría atrapado.
 */

const PALETA = {
  'azul-900': '#1e3f73',
  'azul-700': '#2f5ea8',
  'azul-500': '#4378c6',
  'azul-300': '#899dd9',
  'azul-100': '#dbe4f6',
  'turquesa-700': '#0a7d85',
  'turquesa-500': '#00bdc9',
  menta: '#75d2c1',
  'rosa-700': '#c4166b',
  'rosa-500': '#f83f98',
  magenta: '#e51a68',
  coral: '#ff6e53',
  durazno: '#ff987f',
  naranja: '#fc7f47',
  ambar: '#ffc226',
  amarillo: '#ffed76',
  salvia: '#bcd298',
  tinta: '#16202e',
  papel: '#fbfaf7',
  gris: '#5b6676',
  blanco: '#ffffff',

  // Colores propios de las plantillas de anuncios (doc 03 §6). Van aquí
  // porque son justo donde el contraste se pierde sin que nadie lo note:
  // la decoración tienta a bajar el contraste "para que se vea bonito".
  'papel-prensa': '#f5f2e8',
  pizarra: '#2b4a3f',
  tiza: '#f0ede2',
  corcho: '#b8935f',
  libreta: '#fdfcf5',
};

/** Umbrales de WCAG 2.1 nivel AA. */
const AA_TEXTO = 4.5; // texto normal
const AA_GRANDE = 3.0; // >=24px, o >=18.66px en negrita
const AA_NO_TEXTO = 3.0; // bordes, iconos, indicadores de estado

/** Las combinaciones que el diseño usa de verdad (doc 03). */
const REGLAS = [
  // Texto sobre el fondo de la página
  ['tinta', 'papel', AA_TEXTO, 'texto principal'],
  ['gris', 'papel', AA_TEXTO, 'texto secundario'],
  ['azul-900', 'papel', AA_TEXTO, 'titulares'],
  ['azul-700', 'papel', AA_TEXTO, 'enlaces'],

  // Los dos únicos colores que pueden llevar texto blanco
  ['blanco', 'azul-700', AA_TEXTO, 'boton primario'],
  ['blanco', 'rosa-700', AA_TEXTO, 'boton de noticias'],
  ['blanco', 'turquesa-700', AA_TEXTO, 'boton de guias'],
  ['blanco', 'azul-900', AA_TEXTO, 'encabezado oscuro'],

  // Acentos como fondo, siempre con tinta encima
  ['tinta', 'turquesa-500', AA_TEXTO, 'acento guias'],
  ['tinta', 'menta', AA_TEXTO, 'acento guias suave'],
  ['tinta', 'rosa-500', AA_TEXTO, 'acento noticias'],
  ['tinta', 'coral', AA_TEXTO, 'acento perfiles'],
  ['tinta', 'durazno', AA_TEXTO, 'acento perfiles suave'],
  ['tinta', 'naranja', AA_TEXTO, 'acento perfiles fuerte'],
  ['tinta', 'ambar', AA_TEXTO, 'aviso'],
  ['tinta', 'amarillo', AA_TEXTO, 'resaltado'],
  ['tinta', 'salvia', AA_TEXTO, 'superficie tranquila'],
  ['tinta', 'azul-300', AA_TEXTO, 'superficie azul'],
  ['tinta', 'azul-100', AA_TEXTO, 'superficie azul clara'],

  // Plantillas de anuncios
  ['tinta', 'papel-prensa', AA_TEXTO, 'plantilla periódico'],
  ['tiza', 'pizarra', AA_TEXTO, 'plantilla pizarra'],
  ['tinta', 'libreta', AA_TEXTO, 'plantilla notita'],
  ['tinta', 'corcho', AA_TEXTO, 'plantilla tablón — sello sobre el corcho'],
  ['tinta', 'naranja', AA_TEXTO, 'plantilla afiche'],
  ['blanco', 'rosa-700', AA_TEXTO, 'plantilla urgente — franja superior'],
  ['azul-900', 'blanco', AA_TEXTO, 'plantilla comunicado'],

  // Elementos que no son texto (SC 1.4.11)
  // El foco es un aro doble a propósito: el aro oscuro se ve sobre el papel,
  // el halo ámbar se ve sobre el azul oscuro del encabezado. Un solo color
  // deja sin indicador visible a la mitad del sitio.
  ['azul-900', 'papel', AA_NO_TEXTO, 'aro de foco sobre papel'],
  ['ambar', 'azul-900', AA_NO_TEXTO, 'halo de foco sobre azul oscuro'],
  ['azul-500', 'papel', AA_GRANDE, 'titulares grandes / rellenos'],
];

const canal = (v) =>
  v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

function luminancia(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = canal(((n >> 16) & 255) / 255);
  const g = canal(((n >> 8) & 255) / 255);
  const b = canal((n & 255) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

console.log('\n  Contraste WCAG 2.1 AA — combinaciones que el diseño usa\n');
console.log(
  '  ' +
    'texto'.padEnd(14) +
    'sobre'.padEnd(15) +
    'ratio'.padStart(6) +
    '  min   uso',
);
console.log('  ' + '-'.repeat(74));

let fallos = 0;

for (const [texto, fondo, minimo, uso] of REGLAS) {
  const hexTexto = PALETA[texto];
  const hexFondo = PALETA[fondo];
  if (!hexTexto || !hexFondo) {
    console.log(`  token desconocido: ${texto} / ${fondo}`);
    fallos++;
    continue;
  }
  const r = contraste(hexTexto, hexFondo);
  const pasa = r >= minimo;
  if (!pasa) fallos++;
  console.log(
    '  ' +
      texto.padEnd(14) +
      fondo.padEnd(15) +
      r.toFixed(2).padStart(6) +
      '  ' +
      minimo.toFixed(1) +
      '   ' +
      (pasa ? '' : 'FALLA — ') +
      uso,
  );
}

// Aviso aparte: los colores que la gente asume que pueden llevar texto blanco
// pero no pueden. Estos NO son fallos — son la razón de la Regla 1 del doc 03.
console.log('\n  Recordatorio — texto blanco sobre estos NO cumple AA:');
for (const t of ['azul-500', 'turquesa-500', 'magenta', 'coral', 'naranja']) {
  const r = contraste('#ffffff', PALETA[t]);
  console.log(
    `    blanco sobre ${t.padEnd(14)} ${r.toFixed(2)}  → usa tinta encima`,
  );
}

console.log('');
if (fallos > 0) {
  console.log(`  ${fallos} combinación(es) por debajo del mínimo.\n`);
  process.exit(1);
}
console.log('  Todas las combinaciones cumplen AA.\n');
