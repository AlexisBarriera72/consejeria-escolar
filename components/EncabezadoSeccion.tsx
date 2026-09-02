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

export function EncabezadoSeccion({
  cejilla,
  antes,
  acento,
  despues,
  color,
  lede,
  meta,
}: {
  cejilla: string;
  /** El titular se parte en tres para poder poner UNA palabra en cursiva. */
  antes: string;
  acento: string;
  despues?: string;
  color: AcentoTitular;
  lede?: string;
  /** Cifra o dato a la derecha, como el "ISSUE 09" de la referencia. */
  meta?: React.ReactNode;
}) {
  return (
    <header className="border-tinta/15 border-b pb-10">
      <p className="text-gris flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase">
        <SelloMini className={color} />
        {cejilla}
      </p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <h1
          className="font-titulo text-tinta max-w-3xl text-[2.9rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]"
          style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144" }}
        >
          {antes} <em className={`${color} italic`}>{acento}</em>
          {despues ? ` ${despues}` : ''}
        </h1>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>

      {lede ? (
        <p className="text-gris mt-6 max-w-xl text-lg leading-relaxed">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

/** La cifra grande que acompaña a una cabecera de sección. */
export function MetaCifra({ n, etiqueta }: { n: number; etiqueta: string }) {
  return (
    <p>
      <span className="sr-only">
        {n} {etiqueta}
      </span>
      <span
        aria-hidden
        className="font-titulo text-tinta block text-5xl leading-none font-bold tabular-nums"
        style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        {String(n).padStart(2, '0')}
      </span>
      <span
        aria-hidden
        className="text-gris mt-2 block text-xs font-semibold tracking-[0.14em] uppercase"
      >
        {etiqueta}
      </span>
    </p>
  );
}
