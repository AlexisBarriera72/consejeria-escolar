/**
 * El color propio de cada persona, con la legibilidad garantizada por
 * construcción y no por buena voluntad.
 *
 * EL PROBLEMA QUE RESUELVE: hasta ahora el color era uno de ocho nombres, y
 * `scripts/verificar-contraste.mjs` comprobaba esos ocho en cada build. En
 * cuanto la consejera puede elegir CUALQUIER color, esa comprobación deja de
 * servir: se ejecuta sobre una lista fija, en el build, y el color lo elige
 * ella después, en producción.
 *
 * La garantía tiene que moverse de sitio. Aquí el tono es lo único que se
 * escoge —los 360 grados están todos disponibles— y la CLARIDAD la calcula el
 * programa: para cada tono se busca la versión más profunda que todavía deja
 * leer `tinta` encima a 4.5:1. Así no hay ningún tono prohibido; lo único que
 * no se puede elegir es una claridad que dejaría el nombre de alguien
 * ilegible sobre su propia tarjeta.
 */

/** El texto que va SIEMPRE encima del color de una persona. */
export const TINTA: readonly [number, number, number] = [0x16, 0x20, 0x2e];

/** WCAG 2.1 AA para texto normal. El nombre de una persona no es un titular. */
export const MINIMO = 4.5;

/** Saturación fija. Cambiar el tono es elegir un color; cambiar la saturación
 *  es elegir cuánto grita, y eso no le toca decidirlo a cada perfil. */
const SATURACION = 0.62;

function canal(v: number): number {
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function luminancia([r, g, b]: readonly number[]): number {
  return (
    0.2126 * canal(r! / 255) +
    0.7152 * canal(g! / 255) +
    0.0722 * canal(b! / 255)
  );
}

export function contraste(a: readonly number[], b: readonly number[]): number {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** HSL a RGB. h en grados, s y l entre 0 y 1. */
export function hslARgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}

export function aHex([r, g, b]: readonly number[]): string {
  return (
    '#' +
    [r, g, b].map((v) => Math.round(v!).toString(16).padStart(2, '0')).join('')
  );
}

export function deHex(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * El color de un tono, tan profundo como la legibilidad permita.
 *
 * Para texto oscuro, cuanto más claro es el fondo mayor es el contraste. Así
 * que se busca la claridad MÍNIMA que aún cumple: el resultado es el color más
 * intenso posible de ese tono que no deja a nadie sin poder leer su nombre.
 *
 * Búsqueda binaria y no un bucle a pasos: 24 iteraciones dan una precisión muy
 * por debajo de lo que distingue un ojo, y no depende del tamaño del paso.
 */
/**
 * El tope claro. Por encima de esto el color deja de ser un color y pasa a ser
 * un blanco sucio, y una tarjeta de identidad con eso encima no identifica a
 * nadie. No es una restricción de accesibilidad —más claro siempre contrasta
 * MÁS con la tinta— sino de que siga siendo el color de alguien.
 */
export const CLARIDAD_MAX = 0.9;

/**
 * La claridad MÍNIMA de un tono que aún deja leer `tinta` encima.
 *
 * A partir de aquí, todo lo más claro también vale: con texto oscuro, cuanto
 * más claro es el fondo mayor es el contraste. Esa monotonía es lo que
 * permite ofrecer un deslizador de intensidad sin poder equivocarse — el
 * rango entero por encima del mínimo es legal por construcción, no por
 * comprobarlo después.
 */
export function claridadMinima(tono: number): number {
  const h = ((tono % 360) + 360) % 360;
  let bajo = 0;
  let alto = 1;
  for (let i = 0; i < 24; i++) {
    const medio = (bajo + alto) / 2;
    const c = hslARgb(h, SATURACION, medio);
    // MINIMO + margen, no MINIMO pelado: la búsqueda converge justo en el
    // límite y luego `hslARgb` redondea a enteros de 0 a 255. Sin margen, ese
    // redondeo puede dejar un tono en 4.49 — que es un fallo de AA por una
    // centésima, exactamente el tipo de error que este proyecto ya cazó una
    // vez con #4378c6 (4.43 sobre blanco).
    if (contraste(TINTA, c) >= MINIMO + 0.1) alto = medio;
    else bajo = medio;
  }
  return alto;
}

/**
 * El color de un tono a una intensidad dada.
 *
 * `suavidad` va de 0 a 1: en 0 es el color más profundo que la legibilidad
 * permite, en 1 el más suave que sigue siendo un color. Cualquier punto entre
 * medias cumple AA sin necesidad de comprobar nada, porque el extremo bajo ya
 * cumple y todo lo de arriba contrasta más.
 */
export function colorDe(tono: number, suavidad = 0): string {
  const h = ((tono % 360) + 360) % 360;
  const min = claridadMinima(h);
  const k = Math.max(0, Math.min(1, suavidad));
  const l = min + k * Math.max(0, CLARIDAD_MAX - min);
  return aHex(hslARgb(h, SATURACION, l));
}

/** El color más profundo de un tono. Atajo de `colorDe(tono, 0)`. */
export function colorDeTono(tono: number): string {
  return colorDe(tono, 0);
}

/** Dónde cae un color guardado dentro de su propio rango, de 0 a 1. Sirve
 *  para colocar el deslizador al abrir un perfil que ya tenía color. */
export function suavidadDeHex(hex: string): number {
  const rgb = deHex(hex);
  if (!rgb) return 0;
  const l = (Math.max(...rgb) + Math.min(...rgb)) / 2 / 255;
  const min = claridadMinima(tonoDeHex(hex));
  const rango = CLARIDAD_MAX - min;
  if (rango <= 0) return 0;
  return Math.max(0, Math.min(1, (l - min) / rango));
}

/**
 * ¿Se puede leer `tinta` encima de este color?
 *
 * Se usa en el servidor al guardar un perfil. La comprobación del navegador
 * es comodidad; ESTA es la que manda, porque una acción de servidor es un
 * punto de entrada HTTP y se puede llamar sin pasar por la pantalla. Sin esto,
 * bastaría una petición hecha a mano para dejar el nombre de una persona
 * ilegible sobre su propia tarjeta.
 */
export function colorLegible(hex: string): boolean {
  const rgb = deHex(hex);
  if (!rgb) return false;
  return contraste(TINTA, rgb) >= MINIMO;
}

/** El tono aproximado de un color, para colocar la aguja de la rueda. */
export function tonoDeHex(hex: string): number {
  const rgb = deHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  return (h + 360) % 360;
}
