'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRol } from './ProveedorRol';
import { ROLES, type Rol } from '@/lib/rol';

/**
 * "La hoja de firmas" — el saludo de la puerta (doc 03 §1).
 *
 * Se usa <dialog> nativo a propósito. El navegador da gratis lo que a mano
 * cuesta y se hace mal: atrapar el foco dentro, cerrar con Escape, volver el
 * foco al elemento anterior al cerrar, y dejar inerte el resto de la página
 * para los lectores de pantalla. Un <div> con role="dialog" tiene que
 * reimplementar las cuatro cosas y casi nadie las implementa bien.
 *
 * Pregunta cómo te llamas (opcional) y cuál de tres botones. El nombre se
 * queda en este navegador y solo sirve para el saludo de la portada; el
 * correo no se pide en ninguna parte (doc 09 §1).
 *
 * ── LA TABLILLA, Y POR QUÉ NO ES LA FOTO ENTERA ──────────────────────────
 *
 * La pinza, el borde del cartón y el arranque del papel son fotografía de
 * verdad: `public/tablilla-cabecera.webp`. De ahí para abajo, el cartón y el
 * papel son CSS.
 *
 * La foto original es un retrato de 800x1200 (proporción 0.667). Usarla
 * entera como fondo obligaría a la tarjeta a tener esa proporción fija, y ahí
 * el papel deja de crecer con el texto: en un teléfono a 92vw la zona de
 * papel se queda en unos 310x470 px, y basta con que alguien suba el tamaño
 * de letra para que el formulario se salga del papel y acabe sobre el cartón.
 * Este sitio lo usa gente con baja visión desde teléfonos baratos, así que esa
 * rigidez no es un detalle estético.
 *
 * Partiéndola, la pinza —que es lo que hace que se lea "tablilla"— sigue
 * siendo la foto, y el papel de abajo crece todo lo que haga falta.
 *
 * Los dos colores salen muestreados de esa misma imagen (ver
 * `--color-tablilla-*` en globals.css): si no coincidieran, se vería una
 * costura horizontal justo debajo de la pinza.
 */

/** Medidas leídas de la foto, en tanto por ciento de su ancho (602 px). */
const CARTON_LADO = '4.817%'; // 29 px de cartón a cada lado del papel
const CARTON_PIE = '6.146%'; // 37 px de cartón por debajo del papel

export function PortalEntrada() {
  const { rol, montado, elegir } = useRol();
  const ref = useRef<HTMLDialogElement>(null);
  const refNombre = useRef<HTMLInputElement>(null);
  const debeAbrir = montado && rol === null;

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (debeAbrir && !dialogo.open) dialogo.showModal();
    if (!debeAbrir && dialogo.open) dialogo.close();
  }, [debeAbrir]);

  // Escape y clic fuera cuentan como "invitado": la persona ya dijo que no
  // quiere decir quién es, y volver a preguntarle sería no escucharla.
  const cerrarComoInvitado = () => elegir('invitado');

  function alPulsar(id: Rol, nombre?: string) {
    elegir(id, nombre);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-portal"
      onCancel={(e) => {
        e.preventDefault();
        cerrarComoInvitado();
      }}
      onClick={(e) => {
        // El clic en el propio <dialog> es el clic en el fondo: el panel de
        // dentro lo intercepta antes de llegar hasta aquí.
        if (e.target === ref.current) cerrarComoInvitado();
      }}
      /* POR QUÉ TODAS ESTAS CLASES DE POSICIÓN, que parecen redundantes:
         el navegador centra un <dialog> abierto con showModal() usando
         `margin: auto` en su hoja de estilos interna. Preflight de Tailwind
         pone `margin: 0` a TODO (`*`) y no tiene ninguna regla para dialog,
         así que ese `auto` se pierde y el diálogo se va a la esquina de
         arriba a la izquierda. No es un fallo de este componente: le pasa a
         cualquier <dialog> nativo dentro de Tailwind.

         Se arregla dejando de depender del centrado del navegador: el propio
         <dialog> pasa a ser la capa completa (inset-0) y centra dentro. Hay
         que anular a mano el `width/height: fit-content` y los `max-*` de la
         hoja interna, o inset-0 no lo estira.

         `open:flex` y no `flex` a secas: un <dialog> cerrado es
         `display: none`, y poner `display: flex` sin la variante lo
         enseñaría siempre. */
      className="backdrop:bg-azul-900/50 fixed inset-0 h-full max-h-none w-full max-w-none overflow-x-hidden overflow-y-auto overscroll-contain bg-transparent p-4 backdrop:backdrop-blur-sm open:flex"
    >
      {/* `m-auto` y no `items-center`: con margen automático, cuando la
          tarjeta no cabe el margen se queda en cero y se puede subir con el
          scroll. Centrando con items-center, lo que sobresale por arriba se
          vuelve inalcanzable en pantallas bajas. */}
      <div className="animate-entrada m-auto w-[min(92vw,34rem)]">
        {/* La inclinación va aquí dentro y la animación fuera: `entrada`
            termina en `transform: scale(1)` con fill `both`, así que en el
            mismo elemento borraría el giro.

            La sombra es `drop-shadow` y no `shadow`: la cabecera tiene la
            pinza recortada con transparencia, y `shadow` dibujaría la sombra
            del rectángulo de la imagen — un borde recto cruzando el arco.
            `drop-shadow` sigue el contorno real del canal alfa. */}
        <div className="-rotate-[0.6deg] drop-shadow-[0_18px_30px_rgba(22,32,46,.35)]">
          <Image
            src="/tablilla-cabecera.webp"
            alt=""
            width={602}
            height={211}
            priority
            className="block h-auto w-full select-none"
          />

          {/* El cartón sigue por debajo de la foto. `-mt-px` cierra la
              rendija de un píxel que deja el redondeo subpíxel al escalar la
              imagen a un ancho que no es múltiplo de 602. */}
          <div
            className="bg-tablilla-carton -mt-px rounded-b-2xl"
            style={{
              paddingInline: CARTON_LADO,
              paddingBottom: CARTON_PIE,
            }}
          >
            <div
              className="bg-tablilla-papel px-6 pt-5 pb-7"
              style={{
                // Las rayas de la hoja de firmas.
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0 2.35rem, rgba(47,94,168,.10) 2.35rem 2.4rem)',
                // El papel de la foto se oscurece un poco donde se junta con
                // el cartón. Sin esto, el papel de CSS es plano y el corte se
                // nota como una línea vertical a los lados.
                boxShadow:
                  'inset 4px 0 7px -5px rgba(22,32,46,.28), inset -4px 0 7px -5px rgba(22,32,46,.28)',
              }}
            >
              <h2
                id="titulo-portal"
                className="font-titulo text-azul-900 text-2xl font-bold sm:text-3xl"
              >
                ¿Quién nos visita hoy?
              </h2>
              <p className="text-gris mt-2 text-sm">
                Si quieres, dinos cómo te llamas para saludarte. Nada se guarda
                fuera de este navegador.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="nombre-portal"
                  className="text-azul-900 text-sm font-semibold"
                >
                  Tu nombre{' '}
                  <span className="text-gris font-normal">(opcional)</span>
                </label>
                <input
                  ref={refNombre}
                  id="nombre-portal"
                  type="text"
                  name="nombre"
                  autoComplete="given-name"
                  maxLength={60}
                  placeholder=" p. ej. Ana"
                  className="border-tinta/60 focus:border-azul-500 mt-1.5 w-full rounded-lg border-2 bg-white px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[var(--color-azul-500)]/30"
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {ROLES.filter((r) => r.id !== 'invitado').map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => alPulsar(r.id, refNombre.current?.value)}
                    className={
                      'min-h-16 rounded-xl border-2 px-4 py-3 font-semibold ' +
                      'transition-colors ' +
                      (i === 0
                        ? 'border-azul-700 bg-azul-700 hover:bg-azul-900 text-white'
                        : 'border-azul-700 text-azul-700 hover:bg-azul-100 bg-white')
                    }
                  >
                    {r.etiqueta}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => alPulsar('invitado')}
                  className="text-gris hover:text-azul-700 barrido rounded text-sm underline-offset-4"
                >
                  Continuar como invitado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
