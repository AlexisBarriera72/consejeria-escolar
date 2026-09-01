'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  prefiereMenosMovimiento,
  prefiereMenosMovimientoServidor,
  suscribirMovimiento,
} from '@/lib/movimiento';

const MS_POR_LETRA = 25;
const TOPE_MS = 600;

/**
 * La burbuja del avatar. Escribe el texto letra a letra.
 *
 * IMPORTANTE: quien la use debe pasarle `key={algoQueCambieConElTexto}`.
 * El remontaje es lo que reinicia la animación; sin la key, el texto nuevo
 * empezaría a medio escribir.
 *
 * Dos cosas que no son decoración:
 *  - Con `prefers-reduced-motion` no hay animación ninguna: el texto sale
 *    entero de inmediato.
 *  - La duración total está topada en 600 ms. Sin tope, una frase larga tarda
 *    tanto que la animación pasa de simpática a estorbo.
 */
export function BurbujaDialogo({
  texto,
  className = '',
}: {
  texto: string;
  className?: string;
}) {
  const menosMovimiento = useSyncExternalStore(
    suscribirMovimiento,
    prefiereMenosMovimiento,
    prefiereMenosMovimientoServidor,
  );

  const [letras, setLetras] = useState(0);

  useEffect(() => {
    if (menosMovimiento) return;
    const paso = Math.max(8, Math.min(MS_POR_LETRA, TOPE_MS / texto.length));
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      // Dentro del intervalo es una actualización asíncrona, no un
      // setState síncrono en el cuerpo del efecto: no encadena renders.
      setLetras(i);
      if (i >= texto.length) window.clearInterval(id);
    }, paso);
    return () => window.clearInterval(id);
  }, [texto, menosMovimiento]);

  const visible = menosMovimiento ? texto : texto.slice(0, letras);

  return (
    <div className={`relative ${className}`}>
      <div className="border-borde rounded-2xl border bg-white px-5 py-4 shadow-lg">
        {/*
          El texto COMPLETO va en una capa solo para lectores de pantalla,
          con aria-live: así se anuncia una vez, entero, cuando cambia de
          tarjeta. Si se anunciara el texto que se está escribiendo, el
          lector repetiría la frase entera con cada letra nueva.
        */}
        <p aria-live="polite" className="sr-only">
          {texto}
        </p>
        <p aria-hidden className="text-tinta text-[0.95rem] leading-snug">
          {visible}
        </p>
      </div>
      {/* Pico de la burbuja */}
      <div className="border-borde absolute -bottom-2 left-9 h-4 w-4 rotate-45 border-r border-b bg-white" />
    </div>
  );
}
