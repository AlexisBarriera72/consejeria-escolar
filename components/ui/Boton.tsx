import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';

type Variante = 'primario' | 'secundario' | 'fantasma';
type Tamano = 'normal' | 'grande';

const VARIANTES: Record<Variante, string> = {
  // Solo azul-700 y rosa-700 pueden llevar texto blanco (doc 03, Regla 1).
  primario: 'bg-azul-700 text-white border-azul-700 hover:bg-azul-900',
  secundario: 'bg-white text-azul-700 border-azul-700 hover:bg-azul-100',
  fantasma: 'bg-transparent text-azul-700 border-transparent hover:bg-azul-100',
};

const TAMANOS: Record<Tamano, string> = {
  // 44px de alto mínimo: el objetivo táctil que pide WCAG 2.5.8.
  normal: 'min-h-11 px-5 py-2.5 text-base',
  grande: 'min-h-14 px-7 py-3.5 text-lg',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl border-2 ' +
  'font-semibold transition-colors disabled:opacity-50 ' +
  'disabled:pointer-events-none';

type PropsBase = { variante?: Variante; tamano?: Tamano };

export function Boton({
  variante = 'primario',
  tamano = 'normal',
  className = '',
  ...props
}: ComponentPropsWithoutRef<'button'> & PropsBase) {
  return (
    <button
      className={`${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
      {...props}
    />
  );
}

/** Un enlace con aspecto de botón. Se usa cuando la acción NAVEGA.
 *  Si navega, tiene que ser <a> — un <button> con onClick rompe abrir en
 *  pestaña nueva, copiar el enlace y la navegación por teclado esperada. */
export function EnlaceBoton({
  variante = 'primario',
  tamano = 'normal',
  className = '',
  ...props
}: ComponentPropsWithoutRef<typeof Link> & PropsBase) {
  return (
    <Link
      className={`${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
      {...props}
    />
  );
}
