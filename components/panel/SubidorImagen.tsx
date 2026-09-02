'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { subirFoto } from '@/app/edit/panel/noticias/acciones';

/**
 * Comprime la foto EN EL NAVEGADOR antes de subirla (doc 04 §7).
 *
 * Sin esto, una foto de teléfono de 8 MB se sube entera y luego se sirve
 * entera. El sitio se vuelve lento y la culpa se la lleva el sitio, no la
 * foto. Aquí sale a 1600 px de lado mayor y WebP: unos 300 KB.
 *
 * Se respeta la orientación EXIF usando `createImageBitmap` con
 * `imageOrientation: 'from-image'`. Sin eso, las fotos verticales de iPhone
 * aparecen tumbadas — el clásico misterio de "en mi teléfono se ve bien".
 */

const LADO_MAX = 1600;
const CALIDAD = 0.82;

async function comprimir(archivo: File): Promise<File> {
  const bitmap = await createImageBitmap(archivo, {
    imageOrientation: 'from-image',
  });
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext('2d')?.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    lienzo.toBlob(resolver, 'image/webp', CALIDAD),
  );
  if (!blob) throw new Error('No se pudo comprimir');
  return new File([blob], 'foto.webp', { type: 'image/webp' });
}

const kb = (b: number) => `${Math.round(b / 1024)} KB`;

export function SubidorImagen({
  url,
  alt,
  alCambiarUrl,
  alCambiarAlt,
}: {
  url: string | null;
  alt: string;
  alCambiarUrl: (url: string | null) => void;
  alCambiarAlt: (alt: string) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [pendiente, empezar] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);

  function elegir(archivo: File) {
    setAviso(null);
    empezar(async () => {
      try {
        const original = archivo.size;
        const comprimida = await comprimir(archivo);
        const datos = new FormData();
        datos.append('foto', comprimida);
        const r = await subirFoto(datos);
        if (r.ok) {
          alCambiarUrl(r.url);
          setAviso(`Lista — ${kb(original)} → ${kb(comprimida.size)}`);
        } else {
          setAviso(r.error);
        }
      } catch {
        setAviso('No se pudo procesar esa foto. Prueba con otra.');
      }
    });
  }

  return (
    <div>
      <span className="text-tinta block font-semibold">Foto (opcional)</span>

      {url ? (
        <div className="mt-2">
          <Image
            src={url}
            alt={alt || 'Vista previa de la foto'}
            width={1600}
            height={900}
            className="border-borde max-h-56 w-auto rounded-xl border object-contain"
          />
          <button
            type="button"
            onClick={() => {
              alCambiarUrl(null);
              alCambiarAlt('');
            }}
            className="text-gris hover:text-rosa-700 mt-2 rounded text-sm underline"
          >
            Quitar la foto
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={pendiente}
          className="border-borde hover:border-azul-500 text-gris mt-2 w-full rounded-xl border-2 border-dashed px-4 py-8 disabled:opacity-50"
        >
          {pendiente ? 'Preparando la foto…' : 'Escoge una foto de tu equipo'}
        </button>
      )}

      <input
        ref={entrada}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) elegir(f);
          e.target.value = '';
        }}
      />

      {aviso ? (
        <p role="status" className="text-gris mt-2 text-sm">
          {aviso}
        </p>
      ) : null}

      {url ? (
        <div className="mt-4">
          {/* Nunca se dice "texto alternativo". Se pregunta lo que la
              persona sí sabe contestar. */}
          <label htmlFor="alt" className="text-tinta block font-semibold">
            ¿Qué se ve en la foto?
          </label>
          <p className="text-gris mt-1 text-sm">
            Para quien no puede verla. Una frase corta basta.
          </p>
          <input
            id="alt"
            value={alt}
            onChange={(e) => alCambiarAlt(e.target.value)}
            placeholder="Estudiantes trabajando en la biblioteca"
            className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 px-4 py-3"
          />
        </div>
      ) : null}
    </div>
  );
}
