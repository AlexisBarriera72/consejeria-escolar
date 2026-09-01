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
}: {
  datos: PreguntaConGente;
  mostrarUtilidad?: boolean;
}) {
  const { pregunta, responsables } = datos;

  return (
    <div className="space-y-6">
      <TextoRico html={pregunta.respuesta} className="text-tinta" />

      {pregunta.video ? <ReproductorVideo video={pregunta.video} /> : null}

      {pregunta.adjuntos.length > 0 ? (
        <div>
          <h3 className="text-gris mb-2 text-sm font-semibold">Documentos</h3>
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
          <h3 className="text-gris mb-2 text-sm font-semibold">
            Pregúntale a:
          </h3>
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
