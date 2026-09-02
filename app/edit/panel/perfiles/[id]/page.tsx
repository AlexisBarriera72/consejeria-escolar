import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { EditorPerfil } from '@/components/panel/EditorPerfil';
import { BorrarElemento } from '@/components/panel/BorrarElemento';
import { exigirPanel } from '@/lib/guardia';
import { crudo } from '@/lib/contenido';
import type { Perfil } from '@/lib/tipos';

export default async function EditarPerfil({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesion = await exigirPanel();
  const { id } = await params;
  const todos = await crudo.perfiles();
  const existente = todos.find((p) => p.id === id) ?? null;

  const inicial: Perfil = existente ?? {
    id,
    estado: 'borrador',
    locale: 'es',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: sesion.correo,
    eliminadoEn: null,
    slug: '',
    nombre: '',
    puesto: '',
    escuela: 'Escuela Superior [Nombre]',
    foto: null,
    acento: 'azul',
    estadoDelDia: null,
    frase: null,
    bio: '',
    credenciales: [],
    trabajaEn: [],
    trabajaCon: [],
    contacto: { email: null, extension: null, oficina: null, horario: null },
    orden: todos.length + 1,
  };

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo={existente ? 'Editar perfil' : 'Perfil nuevo'}
      volverA={{ href: '/edit/panel/perfiles', texto: 'Profesionales' }}
    >
      <EditorPerfil
        inicial={inicial}
        otros={todos.filter((p) => p.id !== id && p.eliminadoEn === null)}
        esNuevo={existente === null}
      />
      {existente ? (
        <div className="border-borde mt-12 border-t pt-6">
          <BorrarElemento
            id={id}
            titulo={inicial.nombre}
            tipo="perfil"
            volverA="/edit/panel/perfiles"
          />
        </div>
      ) : null}
    </MarcoPanel>
  );
}
