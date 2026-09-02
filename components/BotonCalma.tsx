'use client';

import { useSyncExternalStore } from 'react';
import {
  alternarCalma,
  calmaActiva,
  calmaServidor,
  suscribirCalma,
} from '@/lib/calma';

export function BotonCalma() {
  const activo = useSyncExternalStore(
    suscribirCalma,
    calmaActiva,
    calmaServidor,
  );

  return (
    <button
      type="button"
      onClick={alternarCalma}
      aria-pressed={activo}
      className="rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
    >
      <span aria-hidden>{activo ? '🌙' : '🍃'}</span>
      <span className="ml-1.5 hidden sm:inline">Modo calma</span>
      <span className="sr-only">
        {activo
          ? '. Activado. Pulsa para desactivarlo.'
          : '. Pulsa para activarlo.'}
      </span>
    </button>
  );
}
