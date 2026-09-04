'use client';

import { useState, useTransition } from 'react';
import { Inicio, type Vistas } from '@/components/Inicio';
import { ROLES, type Rol } from '@/lib/rol';
import type { Portada } from '@/lib/tipos';
import { guardarPortadaAccion } from '@/app/edit/panel/portada/acciones';

/**
 * Editor de la portada.
 *
 * NO reimplementa la página: monta el mismo <Inicio> que ven los estudiantes
 * y le pasa ganchos. Lo que se edita y lo que se publica son literalmente el
 * mismo archivo, así que no pueden separarse con el tiempo — si mañana
 * cambia la maquetación de la portada, este editor cambia con ella sin que
 * nadie tenga que acordarse.
 *
 * Se escribe encima del texto, en su sitio y con su tipografía. Un formulario
 * con veinte campos llamados «lede» o «cejilla» obliga a traducir mentalmente
 * de nombre de variable a trozo de página; aquí lo que se toca es la página.
 */

/** Nombres en castellano para el lector de pantalla. Sin esto, un campo
 *  editable se anuncia solo como «cuadro de texto». */
const ETIQUETAS: Record<string, string> = {
  cejilla: 'Nombre de la oficina',
  escuela: 'Nombre de la escuela',
  tituloAntes: 'Titular, primera parte',
  tituloAcento: 'Titular, palabra destacada',
  tituloDespues: 'Titular, final',
  lede: 'Presentación debajo del titular',
  nota: 'Nota manuscrita junto a las tarjetas',
  recienteEtiqueta: 'Etiqueta del anuncio destacado',
  sinNoticias: 'Texto cuando no hay anuncios',
  puertaAntes: 'Título de la puerta, primera parte',
  puertaAcento: 'Título de la puerta, palabra destacada',
  puertaDespues: 'Título de la puerta, final',
  puertaTexto: 'Texto de la puerta',
  puertaBoton: 'Texto del botón de la puerta',
};

function etiquetaDe(clave: string): string {
  if (ETIQUETAS[clave]) return ETIQUETAS[clave];
  const m = /^secciones\.(\d)\.(titulo|verbo)$/.exec(clave);
  if (m) {
    return m[2] === 'titulo'
      ? `Título de la tarjeta ${Number(m[1]) + 1}`
      : `Enlace de la tarjeta ${Number(m[1]) + 1}`;
  }
  const d = /^secciones\.(\d)\.descripcion\./.exec(clave);
  if (d) return `Descripción de la tarjeta ${Number(d[1]) + 1}`;
  return clave;
}

/** Escribe un valor en una ruta con puntos: "secciones.0.descripcion.aula". */
function conCampo(p: Portada, clave: string, valor: string): Portada {
  const partes = clave.split('.');
  const copia: Portada = structuredClone(p);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nodo: any = copia;
  for (const parte of partes.slice(0, -1)) nodo = nodo[parte];
  nodo[partes[partes.length - 1]!] = valor;
  return copia;
}

export function EditorPortada({
  inicial,
  vistas,
}: {
  inicial: Portada;
  vistas: Vistas;
}) {
  const [portada, setPortada] = useState<Portada>(inicial);
  const [rol, setRol] = useState<Rol>('estudiante');
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [guardando, empezar] = useTransition();

  const sucio = JSON.stringify(portada) !== JSON.stringify(inicial);

  function aplicar(clave: string, valor: string) {
    const limpio = valor.replace(/\s+/g, ' ').trim();
    setPortada((p) => {
      const siguiente = conCampo(p, clave, limpio);
      return JSON.stringify(siguiente) === JSON.stringify(p) ? p : siguiente;
    });
    setGuardado(false);
  }

  function moverTarjeta(desde: number, hacia: number) {
    setPortada((p) => {
      if (hacia < 0 || hacia >= p.secciones.length) return p;
      const secciones = [...p.secciones];
      const [fuera] = secciones.splice(desde, 1);
      secciones.splice(hacia, 0, fuera!);
      return { ...p, secciones };
    });
    setGuardado(false);
  }

  function intercambiarAbajo() {
    setPortada((p) => ({
      ...p,
      ordenAbajo:
        p.ordenAbajo === 'noticias-puerta'
          ? 'puerta-noticias'
          : 'noticias-puerta',
    }));
    setGuardado(false);
  }

  function guardar() {
    setError(null);
    empezar(async () => {
      const r = await guardarPortadaAccion(portada);
      if (r.ok) setGuardado(true);
      else setError(r.error);
    });
  }

  /**
   * Un texto editable en su sitio.
   *
   * `contentEditable` con lectura en `onBlur` y NO en cada tecla: si el
   * estado cambiara con cada pulsación, React volvería a pintar el nodo y el
   * cursor saltaría al principio en mitad de la palabra. Es el fallo clásico
   * de los editables controlados.
   */
  const campo = (clave: string, valor: string) => (
    <span
      key={clave}
      contentEditable
      suppressContentEditableWarning
      tabIndex={0}
      spellCheck
      aria-label={etiquetaDe(clave)}
      onBlur={(e) => aplicar(clave, e.currentTarget.textContent ?? '')}
      onKeyDown={(e) => {
        // Enter confirma en vez de meter un salto de línea: ninguno de estos
        // textos es de varias líneas.
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
          e.currentTarget.textContent = valor;
          e.currentTarget.blur();
        }
      }}
      className="decoration-azul-700/40 -mx-1 cursor-text rounded px-1 underline decoration-dashed underline-offset-4 outline-none focus:bg-white/70 focus:decoration-solid"
    >
      {valor}
    </span>
  );

  const botonMover =
    'bg-crema border-tinta/25 text-tinta hover:bg-white disabled:opacity-30 flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none shadow-sm';

  return (
    <div>
      {/* ── Barra de trabajo ─────────────────────────────────────────── */}
      <div className="border-borde bg-crema sticky top-0 z-30 mb-6 flex flex-wrap items-center gap-4 rounded-2xl border p-4">
        <div>
          <p className="text-tinta text-sm font-semibold">
            Escribe encima del texto
          </p>
          <p className="text-gris text-sm">
            Lo subrayado se puede cambiar. Esto es la portada de verdad.
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-gris text-sm">Ver como:</span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRol(r.id)}
              aria-pressed={rol === r.id}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                rol === r.id
                  ? 'border-azul-700 bg-azul-700 text-white'
                  : 'border-tinta/25 text-tinta hover:bg-white'
              }`}
            >
              {r.corta}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            type="button"
            onClick={guardar}
            disabled={!sucio || guardando}
            className="bg-azul-700 hover:bg-azul-900 rounded-xl px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {guardando ? 'Publicando…' : 'Publicar cambios'}
          </button>
          {sucio && !guardando ? (
            <button
              type="button"
              onClick={() => {
                setPortada(inicial);
                setError(null);
              }}
              className="text-gris hover:text-azul-700 rounded text-sm underline"
            >
              Deshacer todo
            </button>
          ) : null}
          <p role="status" className="text-sm">
            {error ? (
              <span className="text-rosa-700 font-medium">{error}</span>
            ) : guardado ? (
              <span className="text-turquesa-700 font-medium">
                Publicado. Ya se ve en el sitio.
              </span>
            ) : sucio ? (
              <span className="text-gris">Sin publicar</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* ── La portada de verdad ─────────────────────────────────────── */}
      <div className="border-borde overflow-hidden rounded-2xl border">
        <Inicio
          vistas={vistas}
          portada={portada}
          rolForzado={rol}
          ganchos={{
            campo,
            controlesTarjeta: (i) => (
              <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                <button
                  type="button"
                  onClick={() => moverTarjeta(i, i - 1)}
                  disabled={i === 0}
                  className={botonMover}
                  aria-label={`Mover la tarjeta ${i + 1} hacia la izquierda`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moverTarjeta(i, i + 1)}
                  disabled={i === portada.secciones.length - 1}
                  className={botonMover}
                  aria-label={`Mover la tarjeta ${i + 1} hacia la derecha`}
                >
                  →
                </button>
              </div>
            ),
            controlesAbajo: (cual) =>
              cual === 'noticias' ? (
                <button
                  type="button"
                  onClick={intercambiarAbajo}
                  className={`${botonMover} absolute -top-3 left-1/2 z-20 w-auto -translate-x-1/2 gap-2 px-3 text-sm`}
                  aria-label="Intercambiar los dos bloques de abajo"
                >
                  ⇄ Intercambiar
                </button>
              ) : null,
          }}
        />
      </div>
    </div>
  );
}
