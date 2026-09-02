import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn` — combina clases de Tailwind resolviendo los conflictos.
 *
 * Es el ayudante que dan por hecho Aceternity UI, shadcn/ui y React Bits, así
 * que sus componentes se pueden pegar tal cual sin tocarlos.
 *
 * Qué hace, y por qué no basta con juntar cadenas: `clsx` acepta condiciones
 * y las aplana; `twMerge` resuelve los choques entre utilidades quedándose con
 * la ÚLTIMA. Sin él, `cn('px-4', 'px-8')` deja las dos en el HTML y gana la
 * que Tailwind haya puesto antes en la hoja de estilos — que no es la que tú
 * escribiste último. De ahí salen la mitad de los "le puse la clase y no hace
 * nada".
 *
 *   cn('px-4 text-tinta', activo && 'px-8')  →  'text-tinta px-8'
 *
 * OJO en este proyecto: `cn` resuelve conflictos de CLASES, no de contraste.
 * Las reglas de color del doc 03 siguen mandando, y `npm run verificar:contraste`
 * las comprueba.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
