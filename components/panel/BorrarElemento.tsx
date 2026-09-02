'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { borrarNoticia } from '@/app/edit/panel/noticias/acciones';
import { borrarPerfil } from '@/app/edit/panel/perfiles/acciones';

/**
 * Borrar, con la red de seguridad a la vista.
 *
 * No pregunta "¿estás seguro?" — eso no informa de nada, solo asusta. Dice
 * lo que va a pasar y que se puede deshacer. Una acción reversible anunciada
 * como reversible deja de dar miedo, y el miedo es lo que hace que alguien
 * no vuelva a abrir el panel.
 */
export function BorrarElemento({
  id,
  titulo,
  tipo,
  volverA,
}: {
  id: string;
  titulo: string;
  tipo: 'anuncio' | 'perfil';
  volverA: string;
}) {
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
        Borrar este {tipo}
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
        <strong>se puede recuperar durante 30 días</strong> desde la papelera.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pendiente}
          onClick={() =>
            empezar(async () => {
              if (tipo === 'anuncio') await borrarNoticia(id);
              else await borrarPerfil(id);
              router.push(volverA);
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
          No, dejarlo
        </button>
      </div>
    </div>
  );
}
