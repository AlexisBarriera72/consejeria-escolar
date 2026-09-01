import { Fraunces, Source_Sans_3 } from 'next/font/google';

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
  axes: ['SOFT', 'WONK', 'opsz'],
});

/** Texto corrido. Aguanta bien los tamaños pequeños en pantallas baratas,
 *  que es donde va a leerse la mayor parte de este sitio. */
export const fuenteCuerpo = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--fuente-cuerpo',
  display: 'swap',
});

export const clasesDeFuente = `${fuenteTitulo.variable} ${fuenteCuerpo.variable}`;
