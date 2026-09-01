import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CuerpoPregunta } from '@/components/CuerpoPregunta';
import { BotonImprimir } from '@/components/BotonImprimir';
import { TINTE_ACENTO } from '@/components/ui/Tarjeta';
import { soloTexto } from '@/lib/busqueda';
import {
  obtenerCategorias,
  obtenerPregunta,
  obtenerPreguntas,
  obtenerPerfilesPorId,
} from '@/lib/contenido';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const preguntas = await obtenerPreguntas();
  return preguntas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pregunta = await obtenerPregunta(slug);
  if (!pregunta) return { title: 'Guía no encontrada' };
  return {
    title: pregunta.pregunta,
    description: soloTexto(pregunta.respuesta).slice(0, 155),
  };
}

/**
 * Cada guía tiene su propia dirección. Eso es lo que hace posible pegarla en
 * un WhatsApp de madres, ponerla en un código QR en el pasillo (doc 06 §3),
 * o mandarla en un correo — que es como esto va a llegarle a la gente de
 * verdad, no por el buscador.
 */
export default async function PaginaGuia({ params }: Props) {
  const { slug } = await params;
  const pregunta = await obtenerPregunta(slug);
  if (!pregunta) notFound();

  const [responsables, categorias] = await Promise.all([
    obtenerPerfilesPorId(pregunta.responsables),
    obtenerCategorias(),
  ]);
  const categoria = categorias.find((c) => c.id === pregunta.categoriaId);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href="/guias"
        className="text-azul-700 not-print rounded text-sm underline"
      >
        ← Todas las guías
      </Link>

      {categoria ? (
        <p
          className={`text-tinta mt-6 inline-block rounded-full px-3.5 py-1 text-sm font-medium ${TINTE_ACENTO[categoria.acento]}`}
        >
          {categoria.titulo}
        </p>
      ) : null}

      <h1 className="font-titulo text-azul-900 mt-3 text-3xl font-bold sm:text-4xl">
        {pregunta.pregunta}
      </h1>

      <div className="mt-8">
        <CuerpoPregunta datos={{ pregunta, responsables }} />
      </div>

      <div className="border-borde not-print mt-10 flex flex-wrap gap-3 border-t pt-6">
        <BotonImprimir />
        <Link
          href="/guias"
          className="border-borde hover:border-azul-500 rounded-full border px-4 py-1.5 text-sm"
        >
          Ver otras guías
        </Link>
      </div>
    </article>
  );
}
