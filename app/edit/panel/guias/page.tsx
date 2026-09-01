import Link from 'next/link';
import { randomUUID } from 'node:crypto';
import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { exigirPanel } from '@/lib/guardia';
import { panelCategorias, panelPreguntas } from '@/lib/contenido';

export default async function ListaGuias() {
  const sesion = await exigirPanel();
  const [categorias, preguntas] = await Promise.all([
    panelCategorias(),
    panelPreguntas(),
  ]);

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo="Preguntas y Guías"
      descripcion="Las respuestas que ven estudiantes y encargados."
      volverA={{ href: '/edit/panel', texto: 'Panel' }}
    >
      <Link
        href={`/edit/panel/guias/${randomUUID()}`}
        className="bg-azul-700 hover:bg-azul-900 inline-block rounded-xl px-6 py-3 font-semibold text-white"
      >
        + Escribir una guía nueva
      </Link>

      <div className="mt-8 space-y-8">
        {categorias.map((c) => {
          const suyas = preguntas.filter((p) => p.categoriaId === c.id);
          return (
            <section key={c.id}>
              <h2 className="font-titulo text-azul-900 border-borde border-b pb-2 text-lg font-bold">
                {c.titulo}
                <span className="text-gris ml-3 text-sm font-normal">
                  {suyas.length}
                </span>
              </h2>
              {suyas.length === 0 ? (
                <p className="text-gris mt-3 text-sm">
                  Todavía no hay guías en esta sección.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {suyas.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/edit/panel/guias/${p.id}`}
                        className="border-borde hover:border-azul-500 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3"
                      >
                        <span className="text-tinta font-medium">
                          {p.pregunta}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                            p.estado === 'publicado'
                              ? 'bg-menta/40 text-tinta'
                              : 'bg-ambar/40 text-tinta'
                          }`}
                        >
                          {p.estado === 'publicado'
                            ? 'Publicada'
                            : 'Borrador — solo tú la ves'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </MarcoPanel>
  );
}
