import { Inicio, type Vistas } from '@/components/Inicio';
import {
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaLarga } from '@/lib/fechas';

/**
 * Componente de servidor: lee los datos y formatea las fechas. Lo interactivo
 * (buscador, lente por rol, avatar) vive en <Inicio>, que sí es de cliente.
 *
 * La portada ya no lleva cifras ni contadores: esto no es un panel de métricas
 * ni una página de venta, y una fila de números no le resuelve nada a quien
 * llega con una duda.
 */
export default async function PaginaInicio() {
  const [preguntas, noticias, perfiles] = await Promise.all([
    obtenerPreguntas(),
    obtenerNoticias(),
    obtenerPerfiles(),
  ]);

  const destacada = noticias[0] ?? null;
  const consejera = perfiles[0] ?? null;

  const vistas: Vistas = {
    // La lista completa, no un recorte: el buscador necesita poder encontrar
    // "matrícula" aunque sea la novena pregunta.
    guias: preguntas.map((p) => ({ pregunta: p.pregunta, slug: p.slug })),

    destacada: destacada
      ? {
          titulo: destacada.titulo,
          bajada: destacada.bajada,
          fecha: fechaLarga(destacada.publicarEn),
          slug: destacada.slug,
          etiqueta: destacada.etiquetas[0] ?? null,
        }
      : null,

    contacto: consejera
      ? {
          oficina: consejera.contacto.oficina,
          horario: consejera.contacto.horario,
        }
      : null,
  };

  return <Inicio vistas={vistas} />;
}
