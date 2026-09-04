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

/**
 * EL IDIOMA DE LA PÁGINA, en un sitio.
 *
 * Todo el sitio se dibuja con borde de tinta sobre papel, nunca con relleno
 * de color para las acciones. Estas constantes existen para que ese idioma no
 * se copie a mano en catorce archivos: cuando eran cadenas sueltas, una
 * página acababa con `border` y la de al lado con `border-2`, y nadie sabía
 * cuál era la correcta.
 *
 * Van escritas COMPLETAS a propósito. Tailwind analiza el código como texto
 * plano: una clase compuesta en tiempo de ejecución no llega al CSS final.
 */

/** Cualquier superficie elevada: tarjetas, paneles, cajas de aviso. */
export const SUPERFICIE = 'border-tinta bg-crema rounded-[1.25rem] border-2';

/** Una acción. Papel con borde de tinta, NUNCA un relleno de color: el color
 *  ya lo pone la superficie donde se apoya, y dos rellenos seguidos se
 *  anulan el uno al otro. */
export const CHAPA =
  'border-tinta bg-crema text-tinta inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white';

/** Una pegatina pequeña y redonda: números, contadores, «+». */
export const PASTILLA =
  'border-tinta bg-crema text-tinta flex items-center justify-center rounded-full border-2 font-semibold';

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
    <div className={`${SUPERFICIE} overflow-hidden ${className}`}>
      {/* La banda de acento se separa del cuerpo con una línea de tinta, no
          por el cambio de color: sobre el pergamino, un turquesa claro contra
          un crema claro es un borde que algunas personas no ven. */}
      {acento ? (
        <div
          className={`border-tinta h-2.5 border-b-2 ${BANDA_ACENTO[acento]}`}
        />
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  );
}
