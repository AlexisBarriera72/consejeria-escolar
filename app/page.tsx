import { Inicio, type Vistas } from '@/components/Inicio';
import {
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaCorta, fechaLarga } from '@/lib/fechas';

/**
 * Componente de servidor: aquí se leen los datos y se formatean las fechas.
 * Lo interactivo (hover, foco, la lente según el rol) vive en <Inicio>, que
 * sí es de cliente. Así el HTML llega completo desde el servidor —
 * importante cuando alguien abre esto con datos móviles en un pasillo.
 */
export default async function PaginaInicio() {
  const [preguntas, noticias, perfiles] = await Promise.all([
    obtenerPreguntas(),
    obtenerNoticias(),
    obtenerPerfiles(),
  ]);

  const vistas: Vistas = {
    // Todas las preguntas, no tres: el buscador de la portada necesita la
    // lista completa para encontrar "matrícula" aunque esté la novena.
    guias: preguntas.map((p) => ({ pregunta: p.pregunta, slug: p.slug })),
    noticias: noticias.slice(0, 2).map((n) => ({
      titulo: n.titulo,
      fecha: fechaCorta(n.publicarEn),
      slug: n.slug,
    })),
    ultimaEdicion: noticias[0] ? fechaLarga(noticias[0].publicarEn) : null,
    consejered: perfiles.slice(0, 3).map((p) => ({
      nombre: p.nombre,
      puesto: p.puesto,
    })),
    totalPerfiles: perfiles.length,
  };

  return <Inicio vistas={vistas} />;
}
