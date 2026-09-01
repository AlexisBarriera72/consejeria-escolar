import type { Perfil, Pregunta } from '@/lib/tipos';
import { TextoRico } from './TextoRico';
import { ReproductorVideo } from './ReproductorVideo';
import { ChipPersona } from './ChipPersona';
import { AdjuntoEnlace } from './AdjuntoEnlace';
import { UtilidadGuia } from './UtilidadGuia';

export type PreguntaConGente = {
  pregunta: Pregunta;
  responsables: Perfil[];
};

/**
 * El contenido de una pregunta. Lo comparten el acordeón de /guias y la
 * página propia de /guias/[slug], para que las dos vistas no puedan
 * separarse con el tiempo.
 */
export function CuerpoPregunta({
  datos,
  mostrarUtilidad = true,
  nivel = 'h3',
}: {
  datos: PreguntaConGente;
  mostrarUtilidad?: boolean;
  /**
   * Nivel de los subtítulos internos ("Documentos", "Pregúntale a:").
   *
   * Cambia según dónde se use, y no es cosmético: los niveles de encabezado
   * no pueden saltarse. En /guias el h1 es "Preguntas y Guías", la categoría
   * es h2 y aquí toca h3. En /guias/[slug] el h1 es la pregunta misma, así
   * que aquí toca h2 — poner h3 salta el h2 y rompe el criterio 1.3.1.
   *
   * Quien navega con lector de pantalla salta de encabezado en encabezado:
   * un nivel ausente se siente como una sección que falta.
   */
  nivel?: 'h2' | 'h3';
}) {
  const { pregunta, responsables } = datos;
  const Titulo = nivel;

  return (
    <div className="space-y-6">
      <TextoRico html={pregunta.respuesta} className="text-tinta" />

      {pregunta.video ? <ReproductorVideo video={pregunta.video} /> : null}

      {pregunta.adjuntos.length > 0 ? (
        <div>
          <Titulo className="text-gris mb-2 text-sm font-semibold">
            Documentos
          </Titulo>
          <ul className="space-y-2">
            {pregunta.adjuntos.map((a) => (
              <li key={a.url}>
                <AdjuntoEnlace adjunto={a} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {responsables.length > 0 ? (
        <div>
          <Titulo className="text-gris mb-2 text-sm font-semibold">
            Pregúntale a:
          </Titulo>
          <ul className="flex flex-wrap gap-2">
            {responsables.map((p) => (
              <li key={p.id}>
                <ChipPersona perfil={p} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mostrarUtilidad ? (
        <div className="border-borde not-print border-t pt-4">
          <UtilidadGuia slug={pregunta.slug} />
        </div>
      ) : null}
    </div>
  );
}
