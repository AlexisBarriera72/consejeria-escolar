'use client';

import { useCallback } from 'react';

/**
 * Compartir un anuncio.
 *
 * En Puerto Rico la comunicación entre madres y padres de una escuela pasa
 * por WhatsApp, no por Facebook ni por correo. Un anuncio que no se puede
 * reenviar por WhatsApp en dos toques, en la práctica, no se comparte.
 *
 * En teléfono se usa la hoja nativa de compartir del sistema (que ya trae
 * WhatsApp de primero si está instalado). En escritorio, donde esa API casi
 * nunca existe, se abre WhatsApp Web directamente.
 *
 * La URL se lee de window en el momento de pulsar: así no hay que configurar
 * el dominio en ningún sitio y funciona igual en local, en la vista previa y
 * en producción.
 */
export function BotonCompartir({ titulo }: { titulo: string }) {
  const compartir = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        // La persona canceló la hoja de compartir. No es un error.
        return;
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }, [titulo]);

  return (
    <button
      type="button"
      onClick={compartir}
      className="border-borde hover:border-azul-500 not-print rounded-full border px-4 py-1.5 text-sm"
    >
      <span aria-hidden>↗</span> Compartir
    </button>
  );
}
