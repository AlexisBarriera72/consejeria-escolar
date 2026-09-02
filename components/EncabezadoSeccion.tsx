import { SelloMini } from './Sello';

/**
 * La cabecera editorial que comparten las páginas de sección.
 *
 * Un solo componente para que las tres no se separen con el tiempo: la
 * crítica encontró que la portada hablaba un idioma y las secciones otro, y
 * la forma de que eso no vuelva a pasar es que el idioma viva en un archivo.
 *
 * SOBRE EL COLOR DE LA CURSIVA — no es decorativo, es un umbral:
 * `turquesa-700` mide 4.24:1 sobre pergamino. Vale para el titular (WCAG
 * pide 3:1 en texto grande) y NO valdría a 12 px. Por eso la cejilla va
 * siempre en `gris` (5.04:1) y el acento solo toca la palabra enorme.
 */

export type AcentoTitular =
  'text-turquesa-700' | 'text-rosa-700' | 'text-coral-700' | 'text-azul-700';

/**
 * Une el titular con lo que va detrás sin dejar un hueco antes de la
 * puntuación. Sin esto salía «en la escuela .», con el punto separado.
 */
function cola(despues?: string): string {
  if (!despues) return '';
  return /^[.,;:!?…]/.test(despues) ? despues : ` ${despues}`;
}

export function EncabezadoSeccion({
  cejilla,
  antes,
  acento,
  despues,
  color,
  lede,
}: {
  cejilla: string;
  /** El titular se parte en tres para poder poner UNA palabra en cursiva. */
  antes: string;
  acento: string;
  despues?: string;
  color: AcentoTitular;
  lede?: string;
}) {
  return (
    <header className="border-tinta/15 border-b pb-12 text-center">
      <p className="text-gris flex items-center justify-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase">
        <SelloMini className={color} />
        {cejilla}
      </p>

      {/* El titular manda: grande de verdad, y la entradilla por debajo del
          tamaño del cuerpo para que no le compita. Antes iban casi igual de
          grandes y el conjunto no tenía jerarquía. */}
      <h1 className="font-titulo text-tinta mx-auto mt-6 max-w-4xl text-[3.3rem] leading-[0.96] font-bold tracking-[-0.03em] text-balance sm:text-7xl lg:text-[5.25rem]">
        {antes} <em className={`${color} italic`}>{acento}</em>
        {cola(despues)}
      </h1>

      {lede ? (
        <p className="text-gris mx-auto mt-6 max-w-lg text-[0.98rem] leading-relaxed text-pretty">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
