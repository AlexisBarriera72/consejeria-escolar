import {
  Caveat,
  Fraunces,
  Playfair_Display,
  Shantell_Sans,
  Source_Sans_3,
} from 'next/font/google';

/**
 * Las dos fuentes del sitio. Verificadas glifo por glifo con
 * `node scripts/verificar-fuentes.mjs` — ambas cubren á é í ó ú ü ñ Ñ ¿ ¡
 * y las mayúsculas acentuadas.
 *
 * `next/font` las descarga en tiempo de build y las sirve desde nuestro
 * propio dominio. Ninguna petición sale hacia Google cuando alguien visita
 * el sitio, así que no hay nada que rastree a los estudiantes desde aquí.
 */

/** Titulares. Variable, con eje óptico: la misma familia puede leerse
 *  juguetona en la portada y seria en un comunicado oficial. */
export const fuenteTitulo = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-titulo',
  display: 'swap',
  // La cursiva es un archivo aparte y next/font solo carga 'normal' si no se
  // pide. El mundo editorial de la referencia apoya cada titular en UNA
  // palabra en cursiva y color; sin declararla, el navegador la falsearía
  // inclinando la romana, que se nota y se ve mal.
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
});

/** Texto corrido. Aguanta bien los tamaños pequeños en pantallas baratas,
 *  que es donde va a leerse la mayor parte de este sitio. */
export const fuenteCuerpo = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-cuerpo',
  display: 'swap',
});

/**
 * Fuentes decorativas — SOLO para las plantillas de anuncios.
 *
 * `preload: false` a propósito: solo aparecen en algunos anuncios, así que
 * precargarlas en todas las páginas gastaría datos de gente que nunca las va
 * a ver. Se descargan cuando hacen falta.
 *
 * Las tres pasan `npm run verificar:fuentes` — traen á é í ó ú ü ñ Ñ ¿ ¡ y
 * las mayúsculas acentuadas. En tipografías manuscritas eso no se da por
 * hecho: se diseñan en inglés y muchas no llevan ñ.
 */

/** Cabecera del periódico. */
export const fuentePeriodico = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-periodico',
  display: 'swap',
  preload: false,
});

/** La "notita" escrita a mano. */
export const fuenteManuscrita = Caveat({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-manuscrita',
  display: 'swap',
  preload: false,
});

/** La tiza de la pizarra. */
export const fuenteTiza = Shantell_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-tiza',
  display: 'swap',
  preload: false,
});

export const clasesDeFuente = [
  fuenteTitulo.variable,
  fuenteCuerpo.variable,
  fuentePeriodico.variable,
  fuenteManuscrita.variable,
  fuenteTiza.variable,
].join(' ');
