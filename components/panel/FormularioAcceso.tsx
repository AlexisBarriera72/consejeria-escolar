'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Boton } from '@/components/ui/Boton';

export function FormularioAcceso() {
  const router = useRouter();
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const res = await fetch('/api/acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave }),
    }).catch(() => null);

    setEnviando(false);

    if (res?.ok) {
      // `refresh()` antes de navegar para que el servidor vuelva a leer la
      // cookie recién puesta; sin él, /edit/panel se pinta con la sesión
      // vieja y rebota a esta misma pantalla.
      router.refresh();
      router.push('/edit/panel');
      return;
    }

    setError(
      res?.status === 429
        ? 'Demasiados intentos. Espera un cuarto de hora y vuelve a probar.'
        : 'Esa contraseña no es. Inténtalo otra vez.',
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="border-borde bg-crema rounded-2xl border p-7"
    >
      {error ? (
        <p
          role="alert"
          className="border-rosa-700 bg-rosa-500/12 text-tinta mb-5 rounded-xl border-l-4 px-4 py-3 text-sm"
        >
          {error}
        </p>
      ) : null}

      <label htmlFor="clave" className="text-tinta block font-semibold">
        Contraseña
      </label>
      <input
        id="clave"
        name="clave"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[17px]"
      />

      <p className="mt-5">
        <Boton type="submit" tamano="grande" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </Boton>
      </p>

      <p className="text-gris mt-4 text-sm">
        Si no la recuerdas, quien montó el sitio puede generar una nueva. No se
        puede recuperar la anterior: el sitio guarda una huella, no la
        contraseña.
      </p>
    </form>
  );
}
