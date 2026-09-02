import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { BotonRecuperar } from '@/components/panel/BotonRecuperar';
import { exigirPanel } from '@/lib/guardia';
import { panelPapelera } from '@/lib/contenido';
import { fechaLarga } from '@/lib/fechas';

const DIAS = 30;

export default async function PaginaPapelera() {
  const sesion = await exigirPanel();
  const { preguntas, noticias, perfiles } = await panelPapelera();

  const todo = [
    ...preguntas.map((p) => ({
      tipo: 'pregunta' as const,
      id: p.id,
      titulo: p.pregunta,
      fecha: p.eliminadoEn,
      etiqueta: 'Guía',
    })),
    ...noticias.map((a) => ({
      tipo: 'anuncio' as const,
      id: a.id,
      titulo: a.titulo,
      fecha: a.eliminadoEn,
      etiqueta: 'Anuncio',
    })),
    ...perfiles.map((p) => ({
      tipo: 'perfil' as const,
      id: p.id,
      titulo: p.nombre,
      fecha: p.eliminadoEn,
      etiqueta: 'Perfil',
    })),
  ].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));

  return (
    <MarcoPanel
      usuario={sesion.usuario}
      titulo="Papelera"
      descripcion={`Lo que se borró se puede recuperar durante ${DIAS} días.`}
      volverA={{ href: '/edit/panel', texto: 'Panel' }}
    >
      {todo.length === 0 ? (
        <p className="text-gris border-borde rounded-2xl border border-dashed p-10 text-center">
          La papelera está vacía.
        </p>
      ) : (
        <ul className="space-y-2">
          {todo.map((x) => (
            <li
              key={`${x.tipo}-${x.id}`}
              className="border-borde flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3"
            >
              <span className="min-w-0">
                <span className="text-tinta block font-medium">{x.titulo}</span>
                <span className="text-gris text-sm">
                  {x.etiqueta}
                  {x.fecha ? ` · borrado el ${fechaLarga(x.fecha)}` : ''}
                </span>
              </span>
              <BotonRecuperar tipo={x.tipo} id={x.id} />
            </li>
          ))}
        </ul>
      )}
    </MarcoPanel>
  );
}
