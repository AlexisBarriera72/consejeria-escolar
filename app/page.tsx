import { Inicio, type Vistas } from '@/components/Inicio';
import {
  obtenerCategorias,
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaCorta, fechaLarga } from '@/lib/fechas';
import type { Acento } from '@/components/ui/Tarjeta';

/**
 * Componente de servidor: lee los datos y formatea las fechas. Todo lo
 * interactivo (buscador, lente por rol, avatar) vive en <Inicio>, que sí es
 * de cliente, así que el HTML llega completo desde el servidor — importante
 * cuando alguien abre esto con datos móviles en un pasillo.
 *
 * Las cifras de las bandas son CONTEOS REALES del contenido, no adornos.
 * PRODUCT.md prohíbe inventar datos, así que si un día no hay perfiles, el
 * número dirá 0 y la banda se adapta en vez de mentir.
 */
export default async function PaginaInicio() {
  const [preguntas, noticias, perfiles, categorias] = await Promise.all([
    obtenerPreguntas(),
    obtenerNoticias(),
    obtenerPerfiles(),
    obtenerCategorias(),
  ]);

  const destacada = noticias[0] ?? null;

  const vistas: Vistas = {
    // La lista completa, no tres: el buscador de la portada necesita poder
    // encontrar "matrícula" aunque sea la novena pregunta.
    guias: preguntas.map((p) => ({ pregunta: p.pregunta, slug: p.slug })),

    categorias: categorias.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descripcion: c.descripcion,
      acento: c.acento as Acento,
      total: preguntas.filter((p) => p.categoriaId === c.id).length,
    })),

    destacada: destacada
      ? {
          titulo: destacada.titulo,
          bajada: destacada.bajada,
          fecha: fechaLarga(destacada.publicarEn),
          slug: destacada.slug,
          etiqueta: destacada.etiquetas[0] ?? null,
        }
      : null,

    ultimas: noticias.slice(0, 4).map((n) => ({
      titulo: n.titulo,
      fecha: fechaCorta(n.publicarEn),
      slug: n.slug,
      etiqueta: n.etiquetas[0] ?? null,
    })),

    equipo: perfiles.slice(0, 3).map((p) => ({
      nombre: p.nombre,
      puesto: p.puesto,
      slug: p.slug,
      acento: p.acento as Acento,
    })),

    totales: {
      guias: preguntas.length,
      noticias: noticias.length,
      perfiles: perfiles.length,
      categorias: categorias.length,
    },
  };

  return <Inicio vistas={vistas} />;
}
