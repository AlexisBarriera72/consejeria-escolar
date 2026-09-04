import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FotoPerfil } from '@/components/FotoPerfil';
import { TextoRico } from '@/components/TextoRico';
import { TINTE_ACENTO, BORDE_ACENTO } from '@/components/ui/Tarjeta';
import {
  obtenerPerfil,
  obtenerPerfiles,
  obtenerPerfilesPorId,
} from '@/lib/contenido';

type Props = { params: Promise<{ slug: string }> };

/** Prerenderiza todos los perfiles en el build: se sirven como HTML estático,
 *  sin esperar a nada. Importa en un teléfono con datos móviles flojos. */
export async function generateStaticParams() {
  const perfiles = await obtenerPerfiles();
  return perfiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfil = await obtenerPerfil(slug);
  if (!perfil) return { title: 'Perfil no encontrado' };
  return {
    title: perfil.nombre,
    description: `${perfil.puesto} · ${perfil.escuela}`,
  };
}

export default async function PaginaPerfil({ params }: Props) {
  const { slug } = await params;
  const perfil = await obtenerPerfil(slug);
  if (!perfil) notFound();

  // `trabajaCon` ya viene simétrico desde lib/contenido (doc 02 §3).
  const companeros = await obtenerPerfilesPorId(perfil.trabajaCon);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link
        href="/consejered"
        className="text-azul-700 barrido rounded text-sm"
      >
        ← Volver al Pasillo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[16rem_1fr]">
        {/* ── Columna izquierda ─────────────────────────────────────────── */}
        <div>
          <div style={{ rotate: '-1.2deg' }}>
            <FotoPerfil perfil={perfil} tamano="grande" />
          </div>

          {perfil.estadoDelDia ? (
            <p
              className={`text-tinta mt-5 rounded-xl px-4 py-3 text-sm font-medium ${TINTE_ACENTO[perfil.acento]}`}
            >
              {perfil.estadoDelDia}
            </p>
          ) : null}

          <dl className="border-tinta/60 mt-6 space-y-3 border-t pt-6 text-sm">
            {perfil.contacto.oficina ? (
              <div>
                <dt className="text-gris">Dónde encontrarla</dt>
                <dd className="text-tinta font-medium">
                  {perfil.contacto.oficina}
                </dd>
              </div>
            ) : null}
            {perfil.contacto.horario ? (
              <div>
                <dt className="text-gris">Horario</dt>
                <dd className="text-tinta font-medium">
                  {perfil.contacto.horario}
                </dd>
              </div>
            ) : null}
            {perfil.contacto.extension ? (
              <div>
                <dt className="text-gris">Extensión</dt>
                <dd className="text-tinta font-medium">
                  {perfil.contacto.extension}
                </dd>
              </div>
            ) : null}
            {perfil.contacto.email ? (
              <div>
                <dt className="text-gris">Correo</dt>
                <dd>
                  <a
                    href={`mailto:${perfil.contacto.email}`}
                    className="text-azul-700 rounded font-medium underline"
                  >
                    {perfil.contacto.email}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* ── Columna derecha ───────────────────────────────────────────── */}
        <div>
          <h1 className="font-titulo text-tinta text-[2.75rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-[3.5rem]">
            {perfil.nombre}
          </h1>
          <p className="text-tinta mt-1 text-lg">{perfil.puesto}</p>
          <p className="text-gris text-sm">{perfil.escuela}</p>

          {perfil.frase ? (
            <blockquote
              className={`text-tinta mt-7 rounded-xl border-l-4 px-5 py-4 italic ${BORDE_ACENTO[perfil.acento]} ${TINTE_ACENTO[perfil.acento]}`}
            >
              {perfil.frase}
            </blockquote>
          ) : null}

          <section className="mt-9">
            <h2 className="font-titulo text-azul-900 text-xl font-bold">
              Sobre mí
            </h2>
            <TextoRico html={perfil.bio} className="text-tinta mt-3" />
          </section>

          {perfil.credenciales.length > 0 ? (
            <section className="mt-9">
              <h2 className="font-titulo text-azul-900 text-xl font-bold">
                Credenciales
              </h2>
              <ul className="mt-3 space-y-2.5">
                {perfil.credenciales.map((c) => (
                  <li
                    key={c.titulo + c.institucion}
                    className="border-tinta/60 flex flex-wrap items-baseline justify-between gap-x-4 border-b pb-2.5"
                  >
                    <span className="text-tinta font-medium">{c.titulo}</span>
                    <span className="text-gris text-sm">
                      {c.institucion}
                      {c.anio ? ` · ${c.anio}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {perfil.trabajaEn.length > 0 ? (
            <section className="mt-9">
              <h2 className="font-titulo text-azul-900 text-xl font-bold">
                Trabaja en
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {perfil.trabajaEn.map((t) => (
                  <li
                    key={t}
                    className={`text-tinta rounded-full px-3.5 py-1.5 text-sm ${TINTE_ACENTO[perfil.acento]}`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {companeros.length > 0 ? (
            <section className="mt-9">
              <h2 className="font-titulo text-azul-900 text-xl font-bold">
                Trabaja con
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {companeros.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/consejered/${c.slug}`}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-shadow hover:shadow-md ${BORDE_ACENTO[c.acento]}`}
                    >
                      <FotoPerfil perfil={c} tamano="chica" />
                      <span className="min-w-0">
                        <span className="text-azul-900 block truncate font-semibold">
                          {c.nombre}
                        </span>
                        <span className="text-gris block truncate text-sm">
                          {c.puesto}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
