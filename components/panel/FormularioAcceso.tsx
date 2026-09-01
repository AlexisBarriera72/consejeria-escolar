'use client';

import { useState } from 'react';
import { Boton } from '@/components/ui/Boton';

export function FormularioAcceso({ error }: { error?: string }) {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    await fetch('/api/acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo }),
    }).catch(() => {});
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="border-borde rounded-2xl border bg-white p-7">
        <p className="bg-menta/25 text-tinta rounded-xl px-4 py-3">
          Si <strong>{correo}</strong> pertenece al personal, le acabamos de
          enviar un enlace para entrar.
        </p>
        <p className="text-gris mt-4 text-sm">
          El enlace vence en 10 minutos y solo sirve una vez. Si no llega,
          revisa la carpeta de correo no deseado.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="text-azul-700 mt-4 rounded text-sm underline"
        >
          Pedir otro enlace
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="border-borde rounded-2xl border bg-white p-7"
    >
      {error === 'invalido' ? (
        <p className="bg-rosa-500/12 border-rosa-700 text-tinta mb-5 rounded-xl border-l-4 px-4 py-3 text-sm">
          <strong>Ese enlace ya no sirve.</strong> Los enlaces vencen a los 10
          minutos y solo se pueden usar una vez. Pide uno nuevo.
        </p>
      ) : null}

      <label htmlFor="correo" className="text-tinta block font-semibold">
        Tu correo electrónico
      </label>
      <input
        id="correo"
        name="correo"
        type="email"
        required
        autoComplete="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="nombre@escuela.pr"
        className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 px-4 py-3.5 text-[17px]"
      />
      <p className="mt-5">
        <Boton type="submit" tamano="grande" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar enlace de acceso'}
        </Boton>
      </p>
      <p className="text-gris mt-4 text-sm">
        No hay contraseña. Te llega un enlace al correo y con eso entras.
      </p>
    </form>
  );
}
