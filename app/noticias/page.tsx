import type { Metadata } from 'next';
import Link from 'next/link';
import { PlantillaAnuncio } from '@/components/plantillas/Plantillas';
import { TarjetaAnuncio } from '@/components/TarjetaAnuncio';
import { ChipPersona } from '@/components/ChipPersona';
import {
  obtenerDestacada,
  obtenerNoticias,
  obtenerPerfiles,
  obtenerPreguntas,
} from '@/lib/contenido';
import { fechaCorta, fechaLarga } from '@/lib/fechas';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Anuncios y avisos de la oficina de consejería escolar.',
};

export default async function PaginaNoticias() {
  const [destacada, vigentes, perfiles] = await Promise.all([
    obtenerDestacada(),
    obtenerNoticias(),
    obtenerPerfiles(),
  ]);

  const porId = new Map(perfiles.map((p) => [p.id, p]));
  const resto = vigentes.filter((a) => a.id !== destacada?.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-rosa-700 text-sm font-semibold tracking-wide uppercase">
        Consejería Escolar
      </p>
      <h1 className="font-titulo text-azul-900 mt-2 text-4xl font-bold">
        Noticias
      </h1>

      {destacada ? (
        <div className="mt-8">
          <PlantillaAnuncio
            anuncio={destacada}
            autor={
              destacada.autorPerfilId
                ? (porId.get(destacada.autorPerfilId) ?? null)
                : null
            }
            fecha={fechaLarga(destacada.publicarEn)}
          />
        </div>
      ) : (
        <EstadoVacio />
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_16rem]">
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-titulo text-azul-900 text-2xl font-bold">
              Anuncios anteriores
            </h2>
            <Link
              href="/noticias/archivo"
              className="text-azul-700 rounded text-sm underline"
            >
              Ver ediciones anteriores
            </Link>
          </div>

          {resto.length === 0 ? (
            <p className="text-gris border-borde mt-4 rounded-2xl border border-dashed p-8 text-center text-sm">
              No hay más anuncios por ahora.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {resto.map((a) => (
                <TarjetaAnuncio
                  key={a.id}
                  anuncio={a}
                  fecha={fechaCorta(a.publicarEn)}
                />
              ))}
            </div>
          )}
        </section>

        <aside>
          <h2 className="font-titulo text-azul-900 text-lg font-bold">
            Profesionales
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {perfiles.slice(0, 4).map((p) => (
              <li key={p.id}>
                <ChipPersona perfil={p} />
              </li>
            ))}
          </ul>
          <Link
            href="/consejered"
            className="text-azul-700 mt-4 inline-block rounded text-sm underline"
          >
            Ver todo el equipo
          </Link>
        </aside>
      </div>
    </div>
  );
}

/**
 * Qué se ve cuando no hay ningún anuncio vigente.
 *
 * Un sitio escolar no muere el día del lanzamiento: muere en el séptimo mes,
 * cuando lo último publicado es de hace medio año. Con `expiraEn` los
 * anuncios viejos se retiran solos — y entonces hace falta que la página no
 * quede en blanco. Se ofrecen las guías, que no caducan.
 */
async function EstadoVacio() {
  const preguntas = await obtenerPreguntas();
  return (
    <div className="border-borde bg-azul-100/40 mt-8 rounded-2xl border border-dashed p-10 text-center">
      <p className="font-titulo text-azul-900 text-xl font-bold">
        No hay anuncios nuevos ahora mismo.
      </p>
      <p className="text-gris mt-2">Mientras tanto, estas guías te ayudan:</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {preguntas.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link
              href={`/guias/${p.slug}`}
              className="border-borde text-tinta hover:border-azul-500 rounded-full border bg-white px-4 py-1.5 text-sm"
            >
              {p.pregunta}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
