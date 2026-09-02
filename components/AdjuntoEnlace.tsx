import type { Adjunto } from '@/lib/tipos';

function tamano(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Enlace a un documento adjunto.
 *
 * Se muestra el TAMAÑO siempre. Quien está con datos móviles limitados tiene
 * derecho a saber si lo que va a abrir son 200 KB o 8 MB antes de pulsar.
 */
export function AdjuntoEnlace({ adjunto }: { adjunto: Adjunto }) {
  return (
    <a
      href={adjunto.url}
      className="border-borde hover:border-azul-500 bg-crema flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
    >
      <span aria-hidden className="text-2xl">
        📄
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-azul-700 block truncate font-medium underline">
          {adjunto.nombre}
        </span>
        <span className="text-gris block text-sm">
          {tamano(adjunto.tamanoBytes)}
          {!adjunto.esAccesible ? (
            /* Un PDF escaneado es una imagen: un lector de pantalla no
               encuentra nada dentro. Avisarlo es más honesto que dejar que
               alguien lo descargue y descubra que está vacío. */
            <span className="text-tinta bg-ambar ml-2 rounded px-1.5 py-0.5 text-xs">
              Puede no leerse con lector de pantalla
            </span>
          ) : null}
        </span>
      </span>
    </a>
  );
}
