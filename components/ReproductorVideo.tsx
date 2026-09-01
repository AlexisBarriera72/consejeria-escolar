'use client';

import { useState } from 'react';
import type { Video } from '@/lib/tipos';

/** Saca el id de cualquiera de las formas que tiene una URL de YouTube. */
export function idDeYoutube(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

function duracion(seg: number | null): string | null {
  if (!seg) return null;
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Reproductor con fachada: hasta que alguien pulsa "play" NO se carga nada
 * de YouTube.
 *
 * Dos razones, las dos de peso:
 *
 * 1. Peso. Tres iframes reales de YouTube en una página son varios MB antes
 *    de que nadie vea un solo video. En un teléfono con datos móviles en un
 *    pasillo, eso es la diferencia entre una página que abre y una que no.
 *
 * 2. Privacidad. Ni siquiera se carga la miniatura desde los servidores de
 *    Google, que es lo que hace casi todo el mundo. En un sitio de consejería
 *    un estudiante puede estar abriendo una guía sobre ansiedad: que Google
 *    no se entere de que cargó esa página hasta que decida ver el video es
 *    una cortesía barata y real. Por eso la fachada es un bloque de color,
 *    no una miniatura.
 *
 * Al pulsar se usa youtube-nocookie.com, que no pone cookies de seguimiento
 * hasta que hay reproducción.
 */
export function ReproductorVideo({ video }: { video: Video }) {
  const [activo, setActivo] = useState(false);
  const id = video.tipo === 'youtube' ? idDeYoutube(video.url) : null;
  const dur = duracion(video.duracionSeg);

  if (video.tipo === 'youtube' && !id) {
    return (
      <p className="border-borde text-gris rounded-xl border border-dashed p-4 text-sm">
        No se pudo leer el enlace del video.{' '}
        <a href={video.url} className="text-azul-700 underline">
          Abrirlo directamente
        </a>
        .
      </p>
    );
  }

  return (
    <figure className="not-print">
      <div className="bg-azul-900 relative aspect-video overflow-hidden rounded-xl">
        {activo && id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&hl=es&cc_lang_pref=es`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivo(true)}
            className="from-azul-900 to-azul-700 group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br px-6 text-center"
          >
            <span
              aria-hidden
              className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110"
            >
              <span className="border-l-azul-900 ml-1.5 border-y-10 border-l-16 border-y-transparent" />
            </span>
            <span className="font-semibold text-white">
              Reproducir el video
            </span>
            <span className="text-sm text-white/75">
              {video.titulo}
              {dur ? ` · ${dur}` : ''}
            </span>
            <span className="sr-only">
              El video se carga desde YouTube al pulsar.
            </span>
          </button>
        )}
      </div>

      <figcaption className="text-gris mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>{video.titulo}</span>
        {/* La salida que pidió el cliente: si alguien necesita subtítulos o
            quiere verlo en la app, el enlace directo está siempre a mano. */}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-azul-700 rounded underline"
        >
          Ver en YouTube
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </figcaption>
    </figure>
  );
}
