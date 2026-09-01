import type { Metadata } from 'next';
import { GuiasCliente, type SeccionGuia } from '@/components/GuiasCliente';
import { obtenerGuias, obtenerPerfiles } from '@/lib/contenido';

export const metadata: Metadata = {
  title: 'Preguntas y Guías',
  description:
    'Respuestas a las preguntas más comunes sobre lo académico, lo personal y la universidad.',
};

export default async function PaginaGuias() {
  const [guias, perfiles] = await Promise.all([
    obtenerGuias(),
    // Se piden los perfiles UNA vez y se indexan. Resolver los responsables
    // pregunta por pregunta releería la lista entera doce veces.
    obtenerPerfiles(),
  ]);

  const porId = new Map(perfiles.map((p) => [p.id, p]));

  const secciones: SeccionGuia[] = guias.map(({ categoria, preguntas }) => ({
    categoria,
    preguntas: preguntas.map((pregunta) => ({
      pregunta,
      responsables: pregunta.responsables
        .map((id) => porId.get(id))
        .filter((p) => p !== undefined),
    })),
  }));

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-turquesa-700 text-sm font-semibold tracking-wide uppercase">
        Consejería Escolar
      </p>
      <h1 className="font-titulo text-azul-900 mt-2 text-4xl font-bold">
        Preguntas y Guías
      </h1>
      <p className="text-gris mt-3 max-w-2xl">
        Lo que más nos preguntan, contestado. Si no encuentras lo tuyo,
        pregúntale a cualquiera del equipo.
      </p>

      <GuiasCliente secciones={secciones} />
    </div>
  );
}
