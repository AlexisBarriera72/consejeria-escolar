import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlantillaAnuncio } from '@/components/plantillas/Plantillas';
import { BotonCompartir } from '@/components/BotonCompartir';
import { BotonImprimir } from '@/components/BotonImprimir';
import { soloTexto } from '@/lib/busqueda';
import {
  obtenerNoticia,
  obtenerNoticias,
  obtenerPerfilesPorId,
} from '@/lib/contenido';
import { fechaLarga } from '@/lib/fechas';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Con vencidos incluidos: un anuncio que caducó desaparece de la portada,
  // pero su dirección tiene que seguir funcionando. Alguien pudo guardarla o
  // reenviarla por WhatsApp.
  const noticias = await obtenerNoticias({ incluirVencidas: true });
  return noticias.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anuncio = await obtenerNoticia(slug);
  if (!anuncio) return { title: 'Anuncio no encontrado' };
  return {
    title: anuncio.titulo,
    description: anuncio.bajada ?? soloTexto(anuncio.cuerpo).slice(0, 155),
  };
}

export default async function PaginaAnuncio({ params }: Props) {
  const { slug } = await params;
  const anuncio = await obtenerNoticia(slug);
  if (!anuncio) notFound();

  const autor = anuncio.autorPerfilId
    ? ((await obtenerPerfilesPorId([anuncio.autorPerfilId]))[0] ?? null)
    : null;

  const vencido =
    anuncio.expiraEn !== null && new Date(anuncio.expiraEn) < new Date();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href="/noticias"
        className="text-azul-700 not-print barrido rounded text-sm"
      >
        ← Todas las noticias
      </Link>

      {vencido ? (
        <p className="bg-ambar text-tinta mt-5 rounded-xl px-4 py-3 text-sm">
          Este anuncio ya pasó. Lo dejamos disponible por si alguien guardó el
          enlace.
        </p>
      ) : null}

      <div className="mt-6">
        <PlantillaAnuncio
          anuncio={anuncio}
          autor={autor}
          fecha={fechaLarga(anuncio.publicarEn)}
        />
      </div>

      <div className="border-tinta/60 not-print mt-8 flex flex-wrap gap-3 border-t pt-6">
        <BotonCompartir titulo={anuncio.titulo} />
        <BotonImprimir />
        <Link
          href="/noticias/archivo"
          className="border-tinta/60 hover:border-azul-500 rounded-full border px-4 py-1.5 text-sm"
        >
          Ediciones anteriores
        </Link>
      </div>
    </div>
  );
}
