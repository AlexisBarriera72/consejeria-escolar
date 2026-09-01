import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { EditorGuia } from '@/components/panel/EditorGuia';
import { BorrarGuia } from '@/components/panel/BorrarGuia';
import { exigirPanel } from '@/lib/guardia';
import { crudo, panelCategorias, panelPerfiles } from '@/lib/contenido';
import type { Pregunta } from '@/lib/tipos';

export default async function EditarGuia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesion = await exigirPanel();
  const { id } = await params;

  const [todas, categorias, perfiles] = await Promise.all([
    crudo.preguntas(),
    panelCategorias(),
    panelPerfiles(),
  ]);

  const existente = todas.find((p) => p.id === id) ?? null;
  const esNueva = existente === null;

  // Una guía en blanco para empezar. El id ya viene en la dirección, así que
  // recargar la página no crea un duplicado.
  const inicial: Pregunta = existente ?? {
    id,
    estado: 'borrador',
    locale: 'es',
    creadoEn: new Date(0).toISOString(),
    actualizadoEn: new Date(0).toISOString(),
    actualizadoPor: sesion.correo,
    eliminadoEn: null,
    categoriaId: categorias[0]?.id ?? '',
    slug: '',
    pregunta: '',
    respuesta: '',
    video: null,
    adjuntos: [],
    responsables: [],
    orden: 999,
  };

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo={esNueva ? 'Guía nueva' : 'Editar guía'}
      volverA={{ href: '/edit/panel/guias', texto: 'Preguntas y Guías' }}
    >
      <EditorGuia
        inicial={inicial}
        categorias={categorias}
        perfiles={perfiles}
        esNueva={esNueva}
      />

      {!esNueva ? (
        <div className="border-borde mt-12 border-t pt-6">
          <BorrarGuia id={id} titulo={inicial.pregunta} />
        </div>
      ) : null}
    </MarcoPanel>
  );
}
