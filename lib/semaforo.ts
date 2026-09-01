/**
 * Semáforo de Accesibilidad (doc 04 §6).
 *
 * Revisa lo que se está escribiendo y lo explica en español llano, en el
 * momento de escribirlo.
 *
 * Por qué esto y no una auditoría al final: la accesibilidad que se comprueba
 * al publicar no se degrada, porque la persona que puede arreglarla ya está
 * sentada delante. Una auditoría trimestral encuentra los mismos fallos una
 * y otra vez; esto los evita. Y de paso enseña, un anuncio a la vez, sin
 * ninguna sesión de formación.
 *
 * Función pura y sin dependencias, para poder probarla sola.
 */

export type Nivel = 'rojo' | 'amarillo';

export type Hallazgo = {
  nivel: Nivel;
  mensaje: string;
};

export type Revisable = {
  titulo?: string;
  cuerpoHtml?: string;
  imagenAlt?: string | null;
  tieneImagen?: boolean;
  adjuntosNoAccesibles?: number;
};

const TEXTOS_VACIOS = ['aqui', 'aquí', 'click', 'clic', 'enlace', 'aca', 'acá'];
const LARGO_TITULO = 70;

/** Nunca bloquea al azar: rojo solo cuando algo deja fuera a alguien de
 *  verdad. Lo demás avisa y deja publicar. */
export function revisar(x: Revisable): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];
  const titulo = (x.titulo ?? '').trim();
  const html = x.cuerpoHtml ?? '';

  if (titulo.length === 0) {
    hallazgos.push({ nivel: 'rojo', mensaje: 'Falta el título.' });
  } else if (titulo.length > LARGO_TITULO) {
    hallazgos.push({
      nivel: 'amarillo',
      mensaje: `El título tiene ${titulo.length} caracteres; se va a cortar en el celular. Intenta dejarlo en ${LARGO_TITULO}.`,
    });
  }

  // MAYÚSCULAS SOSTENIDAS: los lectores de pantalla las deletrean letra por
  // letra, así que "IMPORTANTE" se oye "i-eme-pe-o-erre-te-a-ene-te-e".
  const letras = titulo.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
  if (letras.length > 4 && letras === letras.toUpperCase()) {
    hallazgos.push({
      nivel: 'amarillo',
      mensaje:
        'El título está todo en mayúsculas. Los lectores de pantalla las deletrean una por una.',
    });
  }

  if (x.tieneImagen && !(x.imagenAlt ?? '').trim()) {
    hallazgos.push({
      nivel: 'rojo',
      mensaje: 'Falta describir la foto. ¿Qué se ve en ella?',
    });
  }

  // Enlaces cuyo texto no dice a dónde llevan. Quien navega con lector de
  // pantalla suele saltar de enlace en enlace: una lista de cinco "aquí"
  // no dice absolutamente nada.
  for (const m of html.matchAll(/<a\b[^>]*>(.*?)<\/a>/gis)) {
    const texto = (m[1] ?? '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .toLowerCase();
    if (texto.length === 0) {
      hallazgos.push({ nivel: 'rojo', mensaje: 'Hay un enlace sin texto.' });
    } else if (TEXTOS_VACIOS.includes(texto.replace(/[.!¡?¿,]/g, ''))) {
      hallazgos.push({
        nivel: 'amarillo',
        mensaje: `Cambia "${texto}" por algo que diga a dónde lleva el enlace.`,
      });
    }
  }

  const sinTexto = html.replace(/<[^>]*>/g, '').trim();
  if (sinTexto.length === 0) {
    hallazgos.push({ nivel: 'rojo', mensaje: 'El mensaje está vacío.' });
  }

  if ((x.adjuntosNoAccesibles ?? 0) > 0) {
    hallazgos.push({
      nivel: 'amarillo',
      mensaje: `Hay ${x.adjuntosNoAccesibles} documento(s) que quizá no se puedan leer con lector de pantalla.`,
    });
  }

  return hallazgos;
}

/** ¿Se puede publicar? Rojo bloquea; amarillo avisa y deja pasar. */
export function puedePublicar(hallazgos: Hallazgo[]): boolean {
  return !hallazgos.some((h) => h.nivel === 'rojo');
}
