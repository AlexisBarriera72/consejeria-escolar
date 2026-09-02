import {
  Caveat,
  Source_Serif_4,
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

/** Titulares.
 *
 *  Antes era Fraunces con el eje WONK a tope: precioso y demasiado vistoso
 *  para una oficina de consejería escolar. Source Serif 4 es de la misma
 *  superfamilia que el cuerpo (Source Sans 3), así que las dos comparten
 *  proporciones y ritmo, y aguanta pesos altos sin volverse decorativa:
 *  contundente en vez de estilizada. */
export const fuenteTitulo = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-titulo',
  display: 'swap',
  style: ['normal', 'italic'],
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
