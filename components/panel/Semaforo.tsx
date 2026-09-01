'use client';

import { puedePublicar, type Hallazgo } from '@/lib/semaforo';

export function Semaforo({ hallazgos }: { hallazgos: Hallazgo[] }) {
  const rojos = hallazgos.filter((h) => h.nivel === 'rojo');
  const amarillos = hallazgos.filter((h) => h.nivel === 'amarillo');
  const todoBien = hallazgos.length === 0;

  return (
    <section
      aria-label="Revisión de accesibilidad"
      className="border-borde rounded-xl border bg-white p-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex gap-1.5" aria-hidden>
          <span
            className={`h-3.5 w-3.5 rounded-full ${todoBien ? 'bg-menta' : 'bg-borde'}`}
          />
          <span
            className={`h-3.5 w-3.5 rounded-full ${amarillos.length ? 'bg-ambar' : 'bg-borde'}`}
          />
          <span
            className={`h-3.5 w-3.5 rounded-full ${rojos.length ? 'bg-rosa-700' : 'bg-borde'}`}
          />
        </span>
        <h3 className="text-tinta font-semibold">
          {todoBien
            ? 'Todo bien'
            : rojos.length > 0
              ? 'Hay que arreglar algo antes de publicar'
              : 'Se puede publicar, pero mira esto'}
        </h3>
      </div>

      {/* role="status" para que un lector de pantalla lo anuncie cuando
          cambie, sin robarle el foco a quien está escribiendo. */}
      <ul role="status" className="mt-3 space-y-2 text-sm">
        {hallazgos.map((h, i) => (
          <li
            key={`${h.nivel}-${i}`}
            className={`rounded-lg px-3 py-2 ${
              h.nivel === 'rojo'
                ? 'bg-rosa-500/12 text-tinta'
                : 'bg-ambar/25 text-tinta'
            }`}
          >
            {h.mensaje}
          </li>
        ))}
      </ul>

      {!puedePublicar(hallazgos) ? (
        <p className="text-gris mt-3 text-sm">
          Lo de arriba en rojo deja fuera a alguien que quiere leer esto. Por
          eso el botón de publicar está desactivado.
        </p>
      ) : null}
    </section>
  );
}
