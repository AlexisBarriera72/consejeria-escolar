import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { EditorPortada } from '@/components/panel/EditorPortada';
import { exigirPanel } from '@/lib/guardia';
import {
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPortada,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaLarga } from '@/lib/fechas';
import type { Vistas } from '@/components/Inicio';

/**
 * La portada, editable en su sitio.
 *
 * Se leen los MISMOS datos que app/page.tsx — las mismas noticias, los mismos
 * perfiles — para que lo que se ve aquí no sea una maqueta con texto de
 * relleno sino la página tal cual está ahora mismo.
 */
export default async function PaginaEditarPortada() {
  const sesion = await exigirPanel();

  const [preguntas, noticias, perfiles, portada] = await Promise.all([
    obtenerPreguntas(),
    obtenerNoticias(),
    obtenerPerfiles(),
    obtenerPortada(),
  ]);

  const destacada = noticias[0] ?? null;
  const consejera = perfiles[0] ?? null;

  const vistas: Vistas = {
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

  return (
    <MarcoPanel
      usuario={sesion.usuario}
      titulo="La portada"
      descripcion="Escribe encima del texto para cambiarlo, y usa las flechas para mover las tarjetas. Nada cambia en el sitio hasta que pulses Publicar."
      volverA={{ href: '/edit/panel', texto: 'Volver al panel' }}
    >
      <EditorPortada inicial={portada} vistas={vistas} />
    </MarcoPanel>
  );
}
