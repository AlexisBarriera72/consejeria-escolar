/**
 * Búsqueda dentro de las guías.
 *
 * Hecha a mano y sin dependencias: son doce preguntas, no doce mil. Meter
 * Fuse.js aquí serían 20 KB para resolver un problema que no existe.
 *
 * Lo que SÍ importa, y es lo que casi todo el mundo se salta: en español hay
 * que ignorar las tildes. Quien busca "matricula" tiene que encontrar
 * "matrícula", y quien busca "ansiedad" desde un teclado sin tildes tiene que
 * encontrar lo mismo que quien la escribe bien. Una comparación normal de
 * cadenas falla en los dos casos, y quien busca no piensa "me faltó la
 * tilde": piensa "aquí no hay nada" y se va.
 */

/** Quita tildes y diéresis, y pasa a minúsculas.
 *
 *  NFD separa cada letra acentuada en letra + marca diacrítica; luego se
 *  borran las marcas (rango U+0300–U+036F). La ñ se conserva a propósito:
 *  en español es una letra distinta, no una n con adorno, y confundir
 *  "año" con "ano" es un error que nadie quiere en un sitio escolar.
 */
const MARCAS = /[̀-ͯ]/g; // marcas diacríticas combinadas
const TILDE_ENE = '̃'; // la virgulilla de la ñ

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(MARCAS, (marca, posicion: number, cadena: string) =>
      esVirgulillaDeEne(marca, posicion, cadena) ? marca : '',
    )
    .normalize('NFC')
    .toLowerCase()
    .trim();
}

function esVirgulillaDeEne(
  marca: string,
  posicion: number,
  cadena: string,
): boolean {
  if (marca !== TILDE_ENE) return false;
  const anterior = cadena[posicion - 1];
  return anterior === 'n' || anterior === 'N';
}

/** Quita las etiquetas HTML para poder buscar dentro de las respuestas. */
export function soloTexto(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Coincide si TODAS las palabras de la consulta aparecen en el texto.
 * Buscar "beca universidad" encuentra lo que hable de las dos cosas, aunque
 * estén en párrafos distintos y en otro orden.
 */
export function coincide(consulta: string, ...campos: string[]): boolean {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return true;
  const heno = normalizar(campos.join(' '));
  return palabras.every((p) => heno.includes(p));
}
