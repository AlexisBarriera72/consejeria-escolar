'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * "¿Te sirvió esta guía?"
 *
 * ⚠ PENDIENTE PARA LA SECCIÓN 14: hoy el voto se guarda SOLO en el navegador
 * de quien vota. Sirve para no volver a preguntarle a la misma persona, pero
 * todavía no llega a ningún contador que la consejera pueda mirar.
 *
 * No es un descuido, es la consecuencia de una decisión de arquitectura
 * (doc 09 §2): el contenido vive como JSON en el repositorio de git, y un
 * contador de votos NO puede vivir ahí — cada voto sería un commit. Los
 * números que cambian solos van al contador de Upstash, junto con las
 * estadísticas mensuales, y eso es la Sección 14.
 *
 * El voto es anónimo por completo: no se guarda quién votó, solo que este
 * navegador ya lo hizo.
 */

const clave = (slug: string) => `consejeria:util:${slug}`;

const oyentes = new Set<() => void>();
const avisar = () => {
  for (const f of oyentes) f();
};

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

function leer(slug: string): 'si' | 'no' | null {
  try {
    const v = window.localStorage.getItem(clave(slug));
    return v === 'si' || v === 'no' ? v : null;
  } catch {
    return null;
  }
}

export function UtilidadGuia({ slug }: { slug: string }) {
  const voto = useSyncExternalStore(
    suscribir,
    () => leer(slug),
    () => null,
  );

  const votar = useCallback(
    (valor: 'si' | 'no') => {
      try {
        window.localStorage.setItem(clave(slug), valor);
      } catch {
        /* sin almacenamiento; el "gracias" no aparecerá, y no pasa nada */
      }
      avisar();
    },
    [slug],
  );

  if (voto) {
    return (
      <p className="text-gris text-sm" role="status">
        Gracias por decírnoslo.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gris text-sm">¿Te sirvió esta guía?</span>
      <button
        type="button"
        onClick={() => votar('si')}
        className="border-borde hover:border-azul-500 rounded-full border px-3.5 py-1 text-sm"
      >
        <span aria-hidden>👍</span> Sí
      </button>
      <button
        type="button"
        onClick={() => votar('no')}
        className="border-borde hover:border-azul-500 rounded-full border px-3.5 py-1 text-sm"
      >
        <span aria-hidden>👎</span> No
      </button>
    </div>
  );
}
