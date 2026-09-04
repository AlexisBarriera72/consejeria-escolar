'use client';

import { useRef } from 'react';
import { colorDe, suavidadDeHex, tonoDeHex } from '@/lib/color';

/**
 * La rueda de tono.
 *
 * Se elige el TONO y nada más. La claridad la calcula `colorDeTono()`: para
 * cada uno de los 360 grados devuelve la versión más profunda que todavía
 * deja leer `tinta` encima a 4.5:1.
 *
 * Eso significa que aquí no hay ningún color prohibido ni ningún aviso rojo
 * que aparezca a media elección. Los 360 tonos están todos disponibles; lo
 * único que no se puede elegir es una claridad que dejaría el nombre de
 * alguien ilegible sobre su propia tarjeta. Es mejor que validar después:
 * nadie escoge algo bonito para que luego le digan que no vale.
 *
 * ── ACCESIBILIDAD ────────────────────────────────────────────────────────
 * La rueda es un adorno para el ratón. El control DE VERDAD es el
 * `<input type="range">` de debajo: tiene foco, flechas del teclado, y un
 * lector de pantalla lo anuncia como lo que es. Una rueda de color que solo
 * responde al puntero deja fuera a quien navega con teclado, y esto lo va a
 * usar una persona que quizá tenga el ratón regular.
 *
 * El círculo lleva `aria-hidden` justamente por eso: duplicarlo para el
 * lector de pantalla sería anunciar dos veces el mismo control.
 */
export function RuedaColor({
  valor,
  onCambio,
}: {
  /** Color actual en hexadecimal. */
  valor: string;
  onCambio: (hex: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tono = tonoDeHex(valor);
  // La intensidad se deduce del color guardado, no se lleva aparte: dos
  // fuentes para el mismo dato acaban discrepando, y el color es el que manda
  // porque es lo que se publica.
  const suavidad = suavidadDeHex(valor);

  /** Del punto donde está el puntero al ángulo respecto al centro. */
  function tonoDesdePuntero(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    // atan2 da 0 a la derecha y crece en sentido antihorario; el degradado
    // cónico empieza arriba y crece en horario. De ahí el +90 y el signo.
    const grados = (Math.atan2(y, x) * 180) / Math.PI + 90;
    return Math.round((grados + 360) % 360);
  }

  function mover(e: React.PointerEvent) {
    // Solo mientras se arrastra, o en el clic inicial.
    if (e.type === 'pointermove' && e.buttons === 0) return;
    const t = tonoDesdePuntero(e);
    if (t !== null) onCambio(colorDe(t, suavidad));
  }

  // La aguja, colocada sobre la circunferencia del anillo.
  const rad = ((tono - 90) * Math.PI) / 180;
  const radio = 42; // % del contenedor

  return (
    <div className="mt-3 flex flex-wrap items-center gap-6">
      <div
        ref={ref}
        aria-hidden
        onPointerDown={mover}
        onPointerMove={mover}
        className="relative h-36 w-36 shrink-0 cursor-pointer rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, hsl(0 62% 50%), hsl(60 62% 50%), hsl(120 62% 50%), hsl(180 62% 50%), hsl(240 62% 50%), hsl(300 62% 50%), hsl(360 62% 50%))',
        }}
      >
        {/* El agujero del centro enseña el color elegido de verdad — el que
            se va a guardar, ya con su claridad corregida — y no el del
            degradado, que es solo una guía para el ojo. */}
        <div
          className="border-tinta absolute inset-[22%] rounded-full border-2"
          style={{ backgroundColor: valor }}
        />
        <span
          className="border-tinta pointer-events-none absolute h-5 w-5 rounded-full border-2 bg-white shadow"
          style={{
            left: `calc(50% + ${Math.cos(rad) * radio}% - 0.625rem)`,
            top: `calc(50% + ${Math.sin(rad) * radio}% - 0.625rem)`,
          }}
        />
      </div>

      <div className="min-w-56 flex-1">
        {/* La etiqueta decía «Tono», que es el término correcto para la
            posición en la rueda… y jerga. Quien no viene del diseño lo lee
            como «lo claro u oscuro que es», y entonces el control parece
            estropeado: lo mueves esperando brillo y te cambia el color.
            Esto lo usa una consejera escolar, no una diseñadora. */}
        <label
          htmlFor="tono"
          className="text-tinta block text-sm font-semibold"
        >
          Elige el color
        </label>
        <input
          id="tono"
          type="range"
          min={0}
          max={359}
          value={tono}
          aria-describedby="tono-nota"
          onChange={(e) => onCambio(colorDe(Number(e.target.value), suavidad))}
          className="mt-2 w-full"
        />
        <p id="tono-nota" className="text-gris mt-2 text-sm">
          Mueve la rueda o la barra para recorrer los colores.
        </p>

        {/* La intensidad. El extremo izquierdo es el color más profundo que la
            legibilidad permite; de ahí hacia la derecha solo se aclara, y con
            texto oscuro aclarar SIEMPRE sube el contraste. Por eso este
            deslizador no puede equivocarse: no hay ninguna posición ilegible
            que alcanzar, no porque se compruebe después sino porque el rango
            empieza justo donde deja de haberlas. */}
        <label
          htmlFor="suavidad"
          className="text-tinta mt-5 block text-sm font-semibold"
        >
          Más fuerte o más suave
        </label>
        <input
          id="suavidad"
          type="range"
          min={0}
          max={100}
          value={Math.round(suavidad * 100)}
          aria-describedby="suavidad-nota"
          onChange={(e) =>
            onCambio(colorDe(tono, Number(e.target.value) / 100))
          }
          className="mt-2 w-full"
        />
        <div
          aria-hidden
          className="border-tinta/40 mt-1 h-2 w-full rounded-full border"
          style={{
            background: `linear-gradient(to right, ${colorDe(tono, 0)}, ${colorDe(tono, 1)})`,
          }}
        />
        <p id="suavidad-nota" className="text-gris mt-2 text-sm">
          Cualquier posición se lee bien. A la izquierda el color más intenso; a
          la derecha, más suave.
        </p>
      </div>
    </div>
  );
}
