import { Inicio, type Vistas } from '@/components/Inicio';
import {
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaCorta } from '@/lib/fechas';

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
    guias: preguntas.slice(0, 3).map((p) => p.pregunta),
    noticias: noticias.slice(0, 2).map((n) => ({
      titulo: n.titulo,
      fecha: fechaCorta(n.publicarEn),
    })),
    consejered: perfiles.slice(0, 3).map((p) => ({
      nombre: p.nombre,
      puesto: p.puesto,
    })),
  };

  return <Inicio vistas={vistas} />;
}
