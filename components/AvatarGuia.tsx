export type Pose = 'neutral' | 'izquierda' | 'centro' | 'derecha';

/** Ángulo del brazo por pose. El avatar está encima de las tarjetas, así que
 *  "izquierda" apunta abajo-izquierda, no de lado. */
const ANGULO: Record<Pose, number> = {
  neutral: 8,
  izquierda: -42,
  centro: 0,
  derecha: 42,
};

/**
 * MARCADOR DE POSICIÓN — el arte real del avatar va aparte (doc 05).
 *
 * Este SVG existe para que el comportamiento se pueda construir y probar
 * ahora: el brazo apunta de verdad a la tarjeta que tiene el cursor o el
 * foco. Cuando llegue el arte definitivo se sustituye este archivo por las
 * cuatro imágenes y nada más cambia, porque la interfaz del componente
 * (`pose`) se queda igual.
 *
 * El avatar es decorativo: la información la lleva la burbuja, que sí es
 * texto real. Por eso va con aria-hidden — un lector de pantalla no debe
 * anunciar "dibujo de una persona señalando".
 */
export function AvatarGuia({
  pose = 'neutral',
  className = '',
}: {
  pose?: Pose;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {/* Sombra en el suelo */}
      <ellipse cx="100" cy="248" rx="52" ry="8" fill="#16202e" opacity="0.08" />

      {/* Cuerpo */}
      <path
        d="M56 244 C56 186 74 158 100 158 C126 158 144 186 144 244 Z"
        fill="var(--color-azul-500)"
      />
      <path
        d="M78 244 C78 200 86 178 100 178 C114 178 122 200 122 244 Z"
        fill="var(--color-azul-300)"
        opacity="0.55"
      />

      {/* Brazo que señala. Gira desde el hombro. */}
      <g
        style={{
          transform: `rotate(${ANGULO[pose]}deg)`,
          transformOrigin: '138px 182px',
          transition: 'transform 180ms ease-out',
        }}
      >
        <rect
          x="130"
          y="176"
          width="16"
          height="62"
          rx="8"
          fill="var(--color-azul-700)"
        />
        <circle cx="138" cy="240" r="11" fill="var(--color-durazno)" />
      </g>

      {/* Cabeza */}
      <circle cx="100" cy="106" r="50" fill="var(--color-durazno)" />
      <path
        d="M52 96 C52 62 72 46 100 46 C128 46 148 62 148 96 C148 78 128 74 100 74 C72 74 52 78 52 96 Z"
        fill="var(--color-azul-900)"
      />

      {/* Cara */}
      <circle cx="84" cy="106" r="5.5" fill="var(--color-azul-900)" />
      <circle cx="116" cy="106" r="5.5" fill="var(--color-azul-900)" />
      <path
        d="M84 124 Q100 138 116 124"
        stroke="var(--color-azul-900)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="68" cy="120" r="7" fill="var(--color-coral)" opacity="0.35" />
      <circle
        cx="132"
        cy="120"
        r="7"
        fill="var(--color-coral)"
        opacity="0.35"
      />
    </svg>
  );
}
