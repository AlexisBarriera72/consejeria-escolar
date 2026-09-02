'use client';

import { useRol } from './ProveedorRol';
import { ROLES } from '@/lib/rol';

/**
 * "Estás viendo como…" — el indicador de la lente (doc 06 §1).
 *
 * Dos arreglos que venían de la crítica:
 *
 *  · Sobre pergamino lleva tinta y un borde sólido. La versión anterior era
 *    blanco sobre `bg-white/10` (3.70:1) con `border-white/35` (1.80:1
 *    contra la cabecera). WCAG 1.4.11 pide 3:1 para bordes de componente, y
 *    el propio CLAUDE.md prohíbe ese patrón por su nombre.
 *  · Ya no dibuja un chevron. Un `⌄` promete un menú desplegable y lo que
 *    hacía era borrar el rol y volver a lanzar el portal. Ahora dice
 *    "Cambiar", que es exactamente lo que ocurre.
 */
export function ChipRol() {
  const { rol, montado, reiniciar } = useRol();

  // Reserva el hueco con el ancho real del chip para que la cabecera no dé
  // un salto al hidratar. El anterior reservaba 128 px y renderizaba 188.
  if (!montado || !rol) return <span className="h-9 w-[9.5rem]" aria-hidden />;

  const etiqueta = ROLES.find((r) => r.id === rol)?.corta ?? 'Invitado';

  return (
    <button
      type="button"
      onClick={reiniciar}
      className="border-tinta/55 text-tinta hover:bg-tinta hidden items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors hover:text-white sm:inline-flex"
    >
      <span className="font-medium">{etiqueta}</span>
      <span aria-hidden className="opacity-60">
        ·
      </span>
      <span className="font-semibold">Cambiar</span>
    </button>
  );
}
