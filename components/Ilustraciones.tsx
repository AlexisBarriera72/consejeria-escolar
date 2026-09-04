/**
 * Ilustraciones planas del sitio.
 *
 * Todas en SVG en línea con los tokens de la paleta. Es lo que en las
 * maquetas hace que la página se sienta viva, y hacerlo así en vez de con
 * imágenes tiene consecuencias prácticas, no solo estéticas:
 *
 *  · Pesan entre 1 y 3 KB cada una y son nítidas a cualquier tamaño.
 *  · Se pintan con los colores del sitio, así que nunca desentonan — y si
 *    algún día cambia la paleta, cambian solas.
 *  · Funcionan sin conexión, porque viajan dentro del HTML.
 *  · No hay licencias que revisar ni ficheros que sustituir.
 *
 * Todas son DECORATIVAS: van con aria-hidden y nunca llevan información que
 * no esté ya escrita al lado en texto.
 */

type Props = { className?: string };

const base = (className: string) => ({
  className,
  'aria-hidden': true as const,
  xmlns: 'http://www.w3.org/2000/svg',
});

/** Megáfono — acompaña a "Lo más reciente". */
export function Megafono({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 100" {...base(className)}>
      <path
        d="M18 46c0-4 3-7 7-7h13l34-20c3-2 7 0 7 4v52c0 4-4 6-7 4L38 59H25c-4 0-7-3-7-7z"
        fill="var(--color-azul-700)"
      />
      <path d="M38 39h8v20h-8z" fill="var(--color-azul-900)" opacity=".45" />
      <path
        d="M40 59h12l3 22c.3 3-2 5-5 5h-4c-2 0-4-1-4-3z"
        fill="var(--color-azul-900)"
      />
      <circle cx="79" cy="49" r="6" fill="var(--color-ambar)" />
      <g
        stroke="var(--color-azul-500)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M94 33l10-6" />
        <path d="M97 49h12" />
        <path d="M94 65l10 6" />
      </g>
    </svg>
  );
}

/** Puerta abierta — acompaña a "La puerta está abierta". */
export function PuertaAbierta({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 110" {...base(className)}>
      {/* Vano */}
      <rect
        x="16"
        y="10"
        width="52"
        height="88"
        rx="3"
        fill="var(--color-azul-100)"
      />
      <rect
        x="16"
        y="10"
        width="52"
        height="88"
        rx="3"
        fill="none"
        stroke="var(--color-azul-900)"
        strokeWidth="4"
      />
      {/* Hoja abierta, en perspectiva */}
      <path
        d="M68 4l34 12v82l-34 10z"
        fill="var(--color-azul-700)"
        stroke="var(--color-azul-900)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect
        x="76"
        y="30"
        width="18"
        height="26"
        rx="2"
        fill="var(--color-azul-900)"
        opacity=".35"
      />
      <circle cx="74" cy="60" r="4" fill="var(--color-ambar)" />
      {/* Luz que entra por el vano */}
      <path d="M20 94l44-52v52z" fill="var(--color-ambar)" opacity=".25" />
      <ellipse
        cx="60"
        cy="102"
        rx="46"
        ry="5"
        fill="var(--color-tinta)"
        opacity=".1"
      />
    </svg>
  );
}

/** Maceta con planta — acompaña al pie. */
export function Maceta({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 110 120" {...base(className)}>
      <g fill="var(--color-salvia)">
        <ellipse cx="55" cy="36" rx="9" ry="26" />
        <ellipse cx="34" cy="46" rx="8" ry="22" transform="rotate(-32 34 46)" />
        <ellipse cx="76" cy="46" rx="8" ry="22" transform="rotate(32 76 46)" />
      </g>
      <g fill="var(--color-menta)" opacity=".85">
        <ellipse cx="22" cy="62" rx="7" ry="17" transform="rotate(-58 22 62)" />
        <ellipse cx="88" cy="62" rx="7" ry="17" transform="rotate(58 88 62)" />
      </g>
      <path
        d="M55 84V38"
        stroke="var(--color-turquesa-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tiesto */}
      <path
        d="M28 84h54l-6 30a4 4 0 0 1-4 3H38a4 4 0 0 1-4-3z"
        fill="var(--color-coral)"
      />
      <rect
        x="24"
        y="78"
        width="62"
        height="11"
        rx="3"
        fill="var(--color-coral-700)"
      />
    </svg>
  );
}

/** Libros y taza — acompaña al buscador. */
export function Libros({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 140 100" {...base(className)}>
      <rect
        x="12"
        y="72"
        width="78"
        height="16"
        rx="3"
        fill="var(--color-naranja)"
      />
      <rect
        x="18"
        y="56"
        width="78"
        height="16"
        rx="3"
        fill="var(--color-azul-700)"
      />
      <rect
        x="10"
        y="40"
        width="78"
        height="16"
        rx="3"
        fill="var(--color-ambar)"
      />
      <g opacity=".3" fill="var(--color-tinta)">
        <rect x="20" y="77" width="3" height="6" rx="1.5" />
        <rect x="26" y="61" width="3" height="6" rx="1.5" />
        <rect x="18" y="45" width="3" height="6" rx="1.5" />
      </g>
      {/* Taza con planta */}
      <path
        d="M100 62h28v20a8 8 0 0 1-8 8h-12a8 8 0 0 1-8-8z"
        fill="var(--color-azul-300)"
      />
      <path
        d="M128 68h5a5 5 0 0 1 0 10h-5"
        fill="none"
        stroke="var(--color-azul-300)"
        strokeWidth="4"
      />
      <g fill="var(--color-salvia)">
        <ellipse cx="114" cy="44" rx="6" ry="16" />
        <ellipse
          cx="103"
          cy="50"
          rx="5"
          ry="12"
          transform="rotate(-34 103 50)"
        />
        <ellipse
          cx="125"
          cy="50"
          rx="5"
          ry="12"
          transform="rotate(34 125 50)"
        />
      </g>
    </svg>
  );
}

/**
 * Subrayado a mano alzada.
 *
 * Dos trazos ligeramente desalineados: uno solo se lee como una regla, y la
 * gracia de un subrayado hecho a mano es justamente que no es recto.
 */
export function Subrayado({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" {...base(className)}>
      <path
        d="M4 10c34-5 71-7 106-6 30 .8 58 3 86 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M14 14c40-3 82-4 122-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

// ── Iconos pequeños ────────────────────────────────────────────────────────

export function IconoLupa({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" {...base(className)}>
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M16 16l4.5 4.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconoLugar({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" {...base(className)}>
      <path
        d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function IconoReloj({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" {...base(className)}>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M12 7.5V12l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconoCalendario({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" {...base(className)}>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="15"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M3.5 10h17M8 3.5v4M16 3.5v4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * El trazo de marcador que va DETRÁS de la palabra destacada del titular.
 *
 * Sustituye al subrayado fino. El cambio no es solo estético: con la palabra
 * en `tinta` sobre ámbar el contraste sube a 10.15:1, mientras que el azul en
 * cursiva sobre la malla se quedaba en 4.59 — correcto, pero sin margen.
 * Aquí la decoración es lo que mejora la lectura, no lo que la estorba.
 *
 * `preserveAspectRatio="none"` para que el trazo se estire al ancho de la
 * palabra sea cual sea, y los bordes irregulares del path para que parezca
 * pasado a mano y no un rectángulo redondeado.
 */
export function TrazoMarcador({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 46"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5.4 31.8C17 22.4 46.6 17.2 94.8 16.1c38.3-.9 74.6 1.4 96.8 6.6 6.2 1.4 5.4 8.4-1.7 10.4-24.2 6.6-64.6 9.9-105 9.6-32.4-.2-60.6-2.6-78.6-6.1-6.1-1.2-6.8-4.6-.9-4.8z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Flecha dibujada a mano, del tipo que se traza al margen de un cuaderno.
 *
 * Conecta una nota manuscrita con lo que señala. Va siempre con `aria-hidden`:
 * lo que dice la nota tiene que entenderse sin ver la flecha, porque para
 * quien usa lector de pantalla la flecha no existe.
 */
export function FlechaMano({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 96" fill="none" aria-hidden className={className}>
      <path
        d="M9 8c16.4 20.6 23.4 39.6 20.4 55.4-1.6 8.4-6.6 13-11 10.6-4.4-2.4-3.6-9.6 3-14.6C33.6 50.2 62 46 96 58.4c9 3.2 17.4 7.6 25 13"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M104.8 78.6 121 71.4l-7.8-15.8"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
