import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { EditorNoticia } from '@/components/panel/EditorNoticia';
import { BorrarElemento } from '@/components/panel/BorrarElemento';
import { exigirPanel } from '@/lib/guardia';
import { crudo, panelPerfiles } from '@/lib/contenido';
import type { Anuncio } from '@/lib/tipos';

export default async function EditarNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesion = await exigirPanel();
  const { id } = await params;

  const [todas, perfiles] = await Promise.all([
    crudo.noticias(),
    panelPerfiles(),
  ]);

  const existente = todas.find((a) => a.id === id) ?? null;

  const inicial: Anuncio = existente ?? {
    id,
    estado: 'borrador',
    locale: 'es',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: sesion.correo,
    eliminadoEn: null,
    slug: '',
    plantilla: 'periodico',
    titulo: '',
    bajada: null,
    cuerpo: '',
    imagen: null,
    etiquetas: [],
    fechaEvento: null,
    horaTexto: null,
    lugar: null,
    autorPerfilId: null,
    destacado: false,
    publicarEn: new Date().toISOString(),
    expiraEn: null,
  };

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo={existente ? 'Editar anuncio' : 'Anuncio nuevo'}
      volverA={{ href: '/edit/panel/noticias', texto: 'Noticias' }}
    >
      <EditorNoticia
        inicial={inicial}
        perfiles={perfiles}
        esNuevo={existente === null}
      />
      {existente ? (
        <div className="border-borde mt-12 border-t pt-6">
          <BorrarElemento
            id={id}
            titulo={inicial.titulo}
            tipo="anuncio"
            volverA="/edit/panel/noticias"
          />
        </div>
      ) : null}
    </MarcoPanel>
  );
}
