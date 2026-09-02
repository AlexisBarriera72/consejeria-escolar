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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        activo
          ? 'border-salvia bg-salvia text-tinta'
          : 'border-tinta/55 text-tinta hover:bg-tinta hover:text-white'
      }`}
    >
      <span aria-hidden>{activo ? '🌙' : '🍃'}</span>
      <span className="hidden font-medium lg:inline">Modo calma</span>
      <span className="sr-only">
        Modo calma.{' '}
        {activo
          ? 'Activado. Pulsa para desactivarlo.'
          : 'Pulsa para activarlo.'}
      </span>
    </button>
  );
}
