'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { borrarGuia } from '@/app/edit/panel/guias/acciones';

/**
 * Borrar, con la red de seguridad a la vista.
 *
 * El diálogo NO pregunta "¿estás seguro?" — eso no da información, solo
 * susto. Dice lo que va a pasar y, sobre todo, que se puede deshacer. Una
 * acción reversible anunciada como reversible deja de dar miedo.
 *
 * Y no está a un clic de la lista: hay que entrar a la guía para poder
 * borrarla. Ninguna acción destructiva debe estar a un clic de una lista.
 */
export function BorrarGuia({ id, titulo }: { id: string; titulo: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, empezar] = useTransition();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="text-gris hover:text-rosa-700 rounded text-sm underline"
      >
        Borrar esta guía
      </button>
    );
  }

  return (
    <div className="border-rosa-700 bg-rosa-500/8 rounded-xl border-2 p-5">
      <p className="text-tinta font-semibold">
        ¿Mandar &ldquo;{titulo}&rdquo; a la papelera?
      </p>
      <p className="text-gris mt-1 text-sm">
        Deja de verse en el sitio, pero{' '}
        <strong>se puede recuperar durante 30 días</strong> desde la papelera
        del panel.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pendiente}
          onClick={() =>
            empezar(async () => {
              await borrarGuia(id);
              router.push('/edit/panel/guias');
            })
          }
          className="bg-rosa-700 rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {pendiente ? 'Moviendo…' : 'Sí, a la papelera'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="border-borde text-tinta rounded-xl border-2 px-5 py-2.5 font-semibold"
        >
          No, dejarla
        </button>
      </div>
    </div>
  );
}
