'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { recuperar, type Tipo } from '@/app/edit/panel/papelera/acciones';

export function BotonRecuperar({ tipo, id }: { tipo: Tipo; id: string }) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();

  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() =>
        empezar(async () => {
          await recuperar(tipo, id);
          router.refresh();
        })
      }
      className="border-azul-700 text-azul-700 hover:bg-azul-100 shrink-0 rounded-lg border-2 px-4 py-2 font-semibold disabled:opacity-50"
    >
      {pendiente ? 'Recuperando…' : 'Recuperar'}
    </button>
  );
}
