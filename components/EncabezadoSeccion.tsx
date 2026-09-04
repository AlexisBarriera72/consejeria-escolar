import { SelloMini } from './Sello';
import { TrazoMarcador } from './Ilustraciones';

/**
 * La cabecera editorial que comparten las páginas de sección.
 *
 * Un solo componente para que las tres no se separen con el tiempo: la
 * crítica encontró que la portada hablaba un idioma y las secciones otro, y
 * la forma de que eso no vuelva a pasar es que el idioma viva en un archivo.
 *
 * SOBRE EL ACENTO DEL TITULAR — antes era la palabra en color, y el color
 * era el umbral: `turquesa-700` valía a 6 rem porque WCAG pide 3:1 en texto
 * grande, y no habría valido a 12 px.
 *
 * Ahora la palabra va en `tinta` sobre un trazo de marcador del color de la
 * sección. El color sigue diciendo en qué sección estás — que era su trabajo —
 * pero deja de ser lo que sostiene la legibilidad: tinta sobre turquesa-500
 * mide 8.9:1 en vez de 4.24:1. La decoración pasa a ser lo que mejora la
 * lectura, en vez de lo que la limita.
 */

export type AcentoTitular =
  'text-turquesa-700' | 'text-rosa-700' | 'text-coral-700' | 'text-azul-700';

/**
 * De qué color es el trazo detrás de la palabra.
 *
 * Escrito como tabla y no compuesto en tiempo de ejecución: Tailwind analiza
 * el código como texto plano, así que una clase construida con plantillas no
 * llega nunca al CSS final.
 */
const TRAZO: Record<AcentoTitular, string> = {
  'text-turquesa-700': 'text-turquesa-500',
  'text-rosa-700': 'text-rosa-500',
  'text-coral-700': 'text-naranja',
  'text-azul-700': 'text-ambar',
};

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
    <header className="pb-12 text-center">
      {/* La cejilla en una chapa de papel, igual que en la portada: se lee
          como etiqueta pegada y el texto pequeño se mide contra `crema` en
          vez de contra la malla de color del fondo. */}
      <p className="group border-tinta/50 bg-crema text-gris inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
        <SelloMini vivo className={`h-3.5 w-3.5 ${color}`} />
        {cejilla}
      </p>

      {/* El titular manda: grande de verdad, y la entradilla por debajo del
          tamaño del cuerpo para que no le compita. Antes iban casi igual de
          grandes y el conjunto no tenía jerarquía. */}
      <h1 className="font-titulo text-tinta mx-auto mt-6 max-w-4xl text-[3.6rem] leading-[0.88] font-bold tracking-[-0.045em] text-balance sm:text-[5rem] lg:text-[6.25rem]">
        {antes}{' '}
        <span className="relative inline-block">
          <TrazoMarcador
            className={`pintar-trazo pointer-events-none absolute top-[16%] -left-[4%] h-[78%] w-[108%] ${TRAZO[color]}`}
          />
          <em className="text-tinta relative italic">{acento}</em>
        </span>
        {cola(despues)}
      </h1>

      {lede ? (
        <p className="text-tinta/85 mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-pretty">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
