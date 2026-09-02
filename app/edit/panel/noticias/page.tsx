import Link from 'next/link';
import { randomUUID } from 'node:crypto';
import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { exigirPanel } from '@/lib/guardia';
import { idsVencidos, panelNoticias } from '@/lib/contenido';
import { fechaCorta } from '@/lib/fechas';
import { PLANTILLAS } from '@/lib/tipos';

export default async function ListaNoticias() {
  const sesion = await exigirPanel();
  const [noticias, vencidos] = await Promise.all([
    panelNoticias(),
    idsVencidos(),
  ]);
  const nombre = new Map(PLANTILLAS.map((p) => [p.id, p.nombre]));

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo="Noticias"
      descripcion="Los anuncios que ven estudiantes y encargados."
      volverA={{ href: '/edit/panel', texto: 'Panel' }}
    >
      <Link
        href={`/edit/panel/noticias/${randomUUID()}`}
        className="bg-azul-700 hover:bg-azul-900 inline-block rounded-xl px-6 py-3 font-semibold text-white"
      >
        + Escribir un anuncio nuevo
      </Link>

      {noticias.length === 0 ? (
        <p className="text-gris border-borde mt-8 rounded-2xl border border-dashed p-10 text-center">
          Todavía no hay anuncios.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {noticias.map((a) => {
            const vencido = vencidos.has(a.id);
            return (
              <li key={a.id}>
                <Link
                  href={`/edit/panel/noticias/${a.id}`}
                  className="border-borde hover:border-azul-500 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="text-tinta block font-medium">
                      {a.destacado ? (
                        <span className="text-ambar mr-1" title="Destacado">
                          ★
                        </span>
                      ) : null}
                      {a.titulo}
                    </span>
                    <span className="text-gris text-sm">
                      {nombre.get(a.plantilla)} · {fechaCorta(a.publicarEn)}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-2">
                    {vencido ? (
                      <span className="text-gris bg-borde/60 rounded-full px-3 py-0.5 text-xs">
                        Ya pasó
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                        a.estado === 'publicado'
                          ? 'bg-menta/40 text-tinta'
                          : 'bg-ambar/40 text-tinta'
                      }`}
                    >
                      {a.estado === 'publicado'
                        ? 'Publicado'
                        : 'Borrador — solo tú lo ves'}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </MarcoPanel>
  );
}
