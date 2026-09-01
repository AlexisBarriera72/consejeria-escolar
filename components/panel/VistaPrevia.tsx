'use client';

import { useState } from 'react';

/**
 * El panel de vista previa.
 *
 * Enseña el contenido con LOS MISMOS componentes que usa el sitio público.
 * No es una imitación parecida: es literalmente el mismo código. Por eso la
 * vista previa no puede mentir, y por eso quien escribe deja de ir a
 * comprobar al sitio de verdad — que es donde pasan los accidentes.
 *
 * El interruptor de teléfono viene seleccionado por defecto, a propósito: la
 * mayoría de quien lee esto lo hace desde el celular, y a la persona que
 * escribe le importa muchísimo cómo se ve ahí.
 */
export function VistaPrevia({ children }: { children: React.ReactNode }) {
  const [movil, setMovil] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-tinta font-semibold">Vista previa</h2>
        <div
          role="group"
          aria-label="Ancho de la vista previa"
          className="border-borde flex overflow-hidden rounded-lg border"
        >
          {(
            [
              ['Teléfono', true],
              ['Computadora', false],
            ] as const
          ).map(([texto, esMovil]) => (
            <button
              key={texto}
              type="button"
              onClick={() => setMovil(esMovil)}
              aria-pressed={movil === esMovil}
              className={`px-3 py-1.5 text-sm font-medium ${
                movil === esMovil
                  ? 'bg-azul-700 text-white'
                  : 'text-tinta bg-white'
              }`}
            >
              {texto}
            </button>
          ))}
        </div>
      </div>

      <div className="border-borde mt-3 overflow-hidden rounded-2xl border-2 bg-white">
        <div
          className={`mx-auto transition-all ${movil ? 'max-w-[390px]' : 'max-w-full'}`}
        >
          {children}
        </div>
      </div>

      <p className="text-gris mt-2 text-sm">
        Así lo verán los estudiantes y los encargados.
      </p>
    </div>
  );
}
