import type { ReactNode } from 'react';

/** Los acentos por sección (doc 03). Cada sección del sitio tiene el suyo
 *  para que se sepa en qué "salón" está uno sin leer el título. */
export type Acento =
  | 'azul'
  | 'turquesa'
  | 'menta'
  | 'rosa'
  | 'coral'
  | 'naranja'
  | 'ambar'
  | 'salvia';

/** Las clases van escritas completas a propósito. Tailwind analiza el código
 *  como texto plano: si construyes `bg-${color}-500` en tiempo de ejecución,
 *  la clase no aparece en el CSS final y el color simplemente no sale. */
export const BANDA_ACENTO: Record<Acento, string> = {
  azul: 'bg-azul-500',
  turquesa: 'bg-turquesa-500',
  menta: 'bg-menta',
  rosa: 'bg-rosa-500',
  coral: 'bg-coral',
  naranja: 'bg-naranja',
  ambar: 'bg-ambar',
  salvia: 'bg-salvia',
};

export const BORDE_ACENTO: Record<Acento, string> = {
  azul: 'border-azul-500',
  turquesa: 'border-turquesa-500',
  menta: 'border-menta',
  rosa: 'border-rosa-500',
  coral: 'border-coral',
  naranja: 'border-naranja',
  ambar: 'border-ambar',
  salvia: 'border-salvia',
};

export const TINTE_ACENTO: Record<Acento, string> = {
  azul: 'bg-azul-100',
  turquesa: 'bg-turquesa-500/15',
  menta: 'bg-menta/25',
  rosa: 'bg-rosa-500/12',
  coral: 'bg-coral/15',
  naranja: 'bg-naranja/15',
  ambar: 'bg-ambar/20',
  salvia: 'bg-salvia/30',
};

export function Tarjeta({
  acento,
  className = '',
  children,
}: {
  acento?: Acento;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`border-borde overflow-hidden rounded-2xl border bg-white ${className}`}
    >
      {acento ? <div className={`h-2 ${BANDA_ACENTO[acento]}`} /> : null}
      <div className="p-6">{children}</div>
    </div>
  );
}
