'use client';

import { ESTILO } from '@/components/TarjetaAnuncio';
import { PLANTILLAS, type PlantillaId } from '@/lib/tipos';

/**
 * El selector de plantilla — la pieza que vende el proyecto (doc 06 §13).
 *
 * Cada miniatura enseña EL TÍTULO QUE SE ESTÁ ESCRIBIENDO, no un texto de
 * relleno. Ver tu propio anuncio convertirse en un periódico de 1920, luego
 * en una nota a mano, luego en una pizarra, en diez segundos y sin riesgo, es
 * el momento en que esto deja de parecer trabajo.
 *
 * Por eso NO hay diálogo de confirmación: cambiar de plantilla no pierde
 * nada — es el mismo contenido con otra piel — y poner una advertencia
 * delante mataría justo lo que hace que se pruebe.
 */
export function SelectorPlantilla({
  valor,
  titulo,
  alCambiar,
}: {
  valor: PlantillaId;
  titulo: string;
  alCambiar: (p: PlantillaId) => void;
}) {
  const muestra = titulo.trim() || 'Tu título aquí';

  return (
    <fieldset>
      <legend className="text-tinta font-semibold">
        Escoge cómo se va a ver
      </legend>
      <p className="text-gris mt-1 text-sm">
        Puedes cambiarlo cuando quieras. No se pierde nada.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PLANTILLAS.map(({ id, nombre }) => {
          const e = ESTILO[id];
          const puesta = valor === id;
          return (
            <label
              key={id}
              className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${
                puesta
                  ? 'border-azul-700 ring-azul-700/25 ring-4'
                  : 'border-borde hover:border-azul-300'
              }`}
            >
              <input
                type="radio"
                name="plantilla"
                className="sr-only"
                checked={puesta}
                onChange={() => alCambiar(id)}
              />
              <span
                className={`block h-24 overflow-hidden rounded-lg border p-2 ${e.caja}`}
              >
                <span
                  className={`line-clamp-3 text-xs leading-tight font-bold ${e.titulo}`}
                >
                  {muestra}
                </span>
              </span>
              <span className="text-tinta mt-1.5 flex items-center justify-center gap-1 text-xs font-medium">
                {puesta ? <span aria-hidden>✓</span> : null}
                {nombre}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
