'use client';

import { useEffect } from 'react';

/**
 * Registra el service worker.
 *
 * Solo en producción: en desarrollo una caché agresiva hace perder tardes
 * enteras persiguiendo cambios que sí se guardaron pero no se ven.
 */
export function RegistroSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    const id = window.setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Que no se registre no rompe nada: el sitio funciona igual, solo
        // sin la parte de "sigue disponible sin conexión".
      });
    }, 1500); // después de que la página termine de cargar
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
