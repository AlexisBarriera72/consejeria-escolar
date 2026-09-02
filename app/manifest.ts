import type { MetadataRoute } from 'next';

/**
 * Manifiesto de la aplicación web.
 *
 * Con esto el sitio se puede "añadir a la pantalla de inicio" y abrirse como
 * una app. Para un estudiante que entra desde el pasillo, un icono en el
 * teléfono es bastante más probable que un marcador del navegador.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Consejería Escolar',
    short_name: 'Consejería',
    description:
      'Guías, noticias y contactos de la oficina de consejería escolar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#4378c6',
    lang: 'es',
    dir: 'ltr',
    categories: ['education'],
    icons: [
      {
        src: '/icono.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
