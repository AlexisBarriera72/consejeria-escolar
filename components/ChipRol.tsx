'use client';

import { useRol } from './ProveedorRol';
import { ROLES } from '@/lib/rol';

/**
 * El indicador de "estás viendo como…" del encabezado.
 *
 * Existe para que la lente (doc 06 §1) sea visible y reversible. Si el sitio
 * reordena el contenido según quién eres, tienes que poder ver que lo hace y
 * poder cambiarlo. Una personalización que no se puede ver ni deshacer se
 * siente como que el sitio te esconde cosas.
 */
export function ChipRol() {
  const { rol, montado, reiniciar } = useRol();

  // Antes de leer localStorage no se sabe qué poner. Se reserva el hueco con
  // el mismo tamaño para que el encabezado no dé un salto al montar.
  if (!montado || !rol) return <span className="h-9 w-32" aria-hidden />;

  const etiqueta = ROLES.find((r) => r.id === rol)?.corta ?? 'Invitado';

  return (
    <button
      type="button"
      onClick={reiniciar}
      className="rounded-full border border-white/35 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
    >
      Viendo como: <span className="font-semibold">{etiqueta}</span>
      <span className="ml-1.5 opacity-70" aria-hidden>
        ⌄
      </span>
      <span className="sr-only">. Pulsa para cambiar.</span>
    </button>
  );
}
