import type { Metadata } from 'next';
import { GuiasCliente, type SeccionGuia } from '@/components/GuiasCliente';
import { EncabezadoSeccion } from '@/components/EncabezadoSeccion';
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
    <div className="contenedor py-14">
      <EncabezadoSeccion
        cejilla="El archivador"
        antes="Preguntas que"
        acento="ya tienen"
        despues="respuesta."
        color="text-turquesa-700"
        lede="Lo que más nos preguntan, contestado. Si no encuentras lo tuyo, pregúntale a cualquiera del equipo."
      />

      <GuiasCliente secciones={secciones} />
    </div>
  );
}
