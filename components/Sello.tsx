/**
 * El sello — la marca radiante del sitio.
 *
 * Es lo que en la referencia editorial hace el trabajo que casi todo el mundo
 * le pide a una fotografía: llenar el espacio, dar textura, y hacer que una
 * página se sienta viva en vez de vacía. Aquí es mejor que una foto por
 * cuatro razones concretas:
 *
 *  · Pesa unos 2 KB y es nítido a cualquier tamaño, desde 12 px hasta 700.
 *  · Se pinta con los tokens del sitio, así que nunca desentona.
 *  · Funciona sin conexión (la PWA lo cachea con el HTML).
 *  · No hay que pedirle permiso a nadie ni sustituirlo cuando lleguen las
 *    fotos reales del equipo.
 *
 * Los pétalos son elipses desplazadas del centro y rotadas: la forma más
 * simple que da una hoja de punta redondeada. Las longitudes salen de una
 * tabla fija, no de Math.random(), porque un valor aleatorio daría un sello
 * en el servidor y otro en el cliente, y React se quejaría de que el HTML no
 * coincide. Fijas además significa que el sello se ve igual en cada visita:
 * es una marca, no un adorno distinto cada vez.
 */

/** Proporciones de longitud por pétalo. La irregularidad es lo que evita que
 *  parezca un asterisco de tipografía. */
const RITMO = [1, 0.62, 0.86, 0.55, 0.95, 0.68, 1, 0.58, 0.9, 0.64, 0.82];

export function Sello({
  className = '',
  petalos = 11,
  giro = 0,
}: {
  className?: string;
  /** Menos pétalos = marca suelta (viñetas). Más = marca densa (marcas de agua). */
  petalos?: number;
  /** Rotación inicial en grados, para que dos sellos vecinos no sean gemelos. */
  giro?: number;
}) {
  const paso = 360 / petalos;

  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        {Array.from({ length: petalos }, (_, i) => {
          const largo = 46 * (RITMO[i % RITMO.length] ?? 0.8);
          return (
            <ellipse
              key={i}
              cx="0"
              cy={-largo / 2}
              rx="5.2"
              ry={largo / 2}
              transform={`rotate(${giro + i * paso})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** El sello a tamaño de viñeta, para las cejillas en versalitas. */
export function SelloMini({ className = '' }: { className?: string }) {
  return <Sello petalos={8} giro={12} className={`h-3 w-3 ${className}`} />;
}
