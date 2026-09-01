'use client';

import { useState, useTransition } from 'react';
import { guardarAvisoAccion } from '@/app/edit/acciones';
import type { Aviso } from '@/lib/tipos';

/**
 * El interruptor del aviso de emergencia.
 *
 * Es el control más importante del panel entero y el que se va a usar en el
 * peor momento — un aviso de huracán, un cierre de última hora — con prisa y
 * probablemente desde un teléfono. Por eso es grande, dice exactamente qué va
 * a pasar, y no esconde nada detrás de un menú.
 */
export function ControlAviso({ aviso }: { aviso: Aviso }) {
  const [activo, setActivo] = useState(aviso.activo);
  const [mensaje, setMensaje] = useState(aviso.mensaje);
  const [nivel, setNivel] = useState(aviso.nivel);
  const [resultado, setResultado] = useState<string | null>(null);
  const [pendiente, empezar] = useTransition();

  function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    empezar(async () => {
      const r = await guardarAvisoAccion(datos);
      setResultado(r.ok ? 'Guardado.' : (r.error ?? 'No se pudo guardar.'));
    });
  }

  return (
    <form
      onSubmit={guardar}
      className={`rounded-2xl border-2 p-6 transition-colors ${
        activo ? 'border-rosa-700 bg-rosa-500/8' : 'border-borde bg-white'
      }`}
    >
      <h2 className="font-titulo text-azul-900 text-xl font-bold">
        Aviso de emergencia
      </h2>
      <p className="text-gris mt-1 text-sm">
        Cuando está activo, aparece arriba de <strong>todas</strong> las páginas
        del sitio.
      </p>

      <label className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          name="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="h-6 w-6"
        />
        <span className="text-tinta font-semibold">
          {activo ? 'Activo — se está mostrando' : 'Apagado'}
        </span>
      </label>

      <label htmlFor="mensaje" className="text-tinta mt-5 block font-semibold">
        Mensaje
      </label>
      <input
        id="mensaje"
        name="mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        maxLength={200}
        placeholder="Ej.: Mañana no habrá clases por aviso de tormenta."
        className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 px-4 py-3"
      />

      <fieldset className="mt-5">
        <legend className="text-tinta font-semibold">Tipo</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(['info', 'urgente'] as const).map((n) => (
            <label key={n} className="flex items-center gap-2">
              <input
                type="radio"
                name="nivel"
                value={n}
                checked={nivel === n}
                onChange={() => setNivel(n)}
                className="h-5 w-5"
              />
              <span className="text-tinta">
                {n === 'info' ? 'Información (ámbar)' : 'Urgente (rojo)'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pendiente}
          className="bg-azul-700 hover:bg-azul-900 rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {pendiente ? 'Guardando…' : 'Guardar aviso'}
        </button>
        {resultado ? (
          <p role="status" className="text-gris text-sm">
            {resultado}
          </p>
        ) : null}
      </div>
    </form>
  );
}
