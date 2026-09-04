import Link from 'next/link';
import type { Anuncio, PlantillaId } from '@/lib/tipos';

/**
 * Tarjeta de un anuncio en las listas y en el archivo.
 *
 * Cada tarjeta lleva UNA pista visual de su plantilla — el papel de prensa,
 * el corcho, la pizarra — en vez de reproducirla entera. Así el archivo se ve
 * como una pared con cosas distintas colgadas y no como una lista de enlaces,
 * sin duplicar las ocho plantillas en versión pequeña.
 */

export const ESTILO: Record<
  PlantillaId,
  { caja: string; titulo: string; sello: string }
> = {
  periodico: {
    caja: 'bg-papel-prensa border-tinta/20',
    titulo: 'font-periodico text-tinta',
    sello: 'Periódico',
  },
  blog: {
    caja: 'bg-white border-tinta/60',
    titulo: 'font-titulo text-azul-900',
    sello: 'Artículo',
  },
  afiche: {
    caja: 'bg-naranja border-naranja',
    titulo: 'font-titulo text-tinta font-black',
    sello: 'Afiche',
  },
  notita: {
    caja: 'bg-libreta border-amarillo -rotate-1',
    titulo: 'font-manuscrita text-azul-900 text-2xl',
    sello: 'Notita',
  },
  corcho: {
    caja: 'bg-corcho border-corcho',
    titulo: 'font-titulo text-tinta',
    sello: 'Tablón',
  },
  comunicado: {
    caja: 'bg-white border-azul-900/30',
    titulo: 'font-titulo text-azul-900',
    sello: 'Comunicado',
  },
  pizarra: {
    caja: 'bg-pizarra border-[#8a6a44]',
    titulo: 'font-tiza text-tiza',
    sello: 'Pizarra',
  },
  urgente: {
    caja: 'bg-white border-rosa-700',
    titulo: 'font-titulo text-tinta',
    sello: 'Urgente',
  },
};

export function TarjetaAnuncio({
  anuncio,
  fecha,
  vencido = false,
}: {
  anuncio: Anuncio;
  fecha: string;
  vencido?: boolean;
}) {
  const e = ESTILO[anuncio.plantilla] ?? ESTILO.blog;
  const enPizarra = anuncio.plantilla === 'pizarra';

  return (
    <Link
      href={`/noticias/${anuncio.slug}`}
      className={`block rounded-[1.25rem] border-2 p-5 transition-shadow hover:shadow-lg ${e.caja} ${vencido ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs tracking-widest uppercase ${enPizarra ? 'text-tiza/70' : 'text-gris'}`}
        >
          {e.sello}
        </span>
        <span className={`text-xs ${enPizarra ? 'text-tiza/70' : 'text-gris'}`}>
          {fecha}
        </span>
      </div>

      <h3 className={`mt-3 text-lg leading-snug font-bold ${e.titulo}`}>
        {anuncio.titulo}
      </h3>

      {anuncio.bajada ? (
        <p
          className={`mt-2 line-clamp-2 text-sm ${enPizarra ? 'text-tiza/85' : 'text-gris'}`}
        >
          {anuncio.bajada}
        </p>
      ) : null}

      {vencido ? <p className="text-gris mt-3 text-xs">Ya pasó</p> : null}
    </Link>
  );
}
