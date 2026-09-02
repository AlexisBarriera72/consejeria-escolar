'use client';

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
 */
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
      className="backdrop:bg-azul-900/50 bg-transparent p-0 backdrop:backdrop-blur-sm"
    >
      <div className="w-[min(92vw,34rem)] -rotate-[0.6deg]">
        {/* La pinza metálica de la tablilla */}
        <div className="relative z-10 mx-auto h-7 w-28 rounded-t-md rounded-b-lg bg-gradient-to-b from-[#9aa4b2] to-[#6b7686] shadow-md">
          <div className="absolute inset-x-4 top-2 h-1 rounded-full bg-white/40" />
        </div>

        <div
          className="-mt-3 rounded-2xl bg-[#fdfcf7] p-7 pt-9 shadow-2xl"
          // Las rayas de la hoja de firmas. El formulario desapareció, pero
          // la metáfora de la tablilla en la puerta sobrevive.
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0 2.35rem, rgba(47,94,168,.10) 2.35rem 2.4rem)',
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
              className="border-borde focus:border-azul-500 mt-1.5 w-full rounded-lg border-2 bg-white px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[var(--color-azul-500)]/30"
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
              className="text-gris hover:text-azul-700 rounded text-sm underline underline-offset-4"
            >
              Continuar como invitado
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
