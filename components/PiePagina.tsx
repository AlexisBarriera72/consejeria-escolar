import Link from 'next/link';
import { Sello } from './Sello';
import { obtenerPerfiles } from '@/lib/contenido';

const COLUMNAS = [
  {
    titulo: 'Leer',
    enlaces: [
      { href: '/guias', texto: 'Preguntas y guías' },
      { href: '/noticias', texto: 'Noticias' },
      { href: '/noticias/archivo', texto: 'Ediciones anteriores' },
    ],
  },
  {
    titulo: 'La oficina',
    enlaces: [
      { href: '/consejered', texto: 'El equipo' },
      { href: '/calendario', texto: 'Disponibilidad' },
    ],
  },
  {
    titulo: 'Este sitio',
    enlaces: [
      { href: '/accesibilidad', texto: 'Accesibilidad' },
      { href: '/creditos', texto: 'Créditos' },
      { href: '/edit', texto: 'Personal de la escuela' },
    ],
  },
];

export async function PiePagina() {
  const perfiles = await obtenerPerfiles();
  const consejera = perfiles[0] ?? null;

  return (
    <footer className="mt-24">
      {/* ── Bloque oscuro ────────────────────────────────────────────────
          En la referencia este slot es la suscripción al boletín. Aquí no
          puede serlo: el producto no recoge correos. Se queda con la forma
          — bloque oscuro, marca de agua, titular con una palabra en cursiva
          — y lo llena con lo que la crítica señaló que faltaba en todo el
          sitio: dónde está y cuándo. */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="bg-azul-900 relative overflow-hidden rounded-3xl px-7 py-12 text-white sm:px-12">
          <Sello
            petalos={13}
            giro={8}
            className="pointer-events-none absolute -right-16 -bottom-24 h-80 w-80 text-white/10"
          />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-titulo text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl">
                La puerta está{' '}
                <em className="text-ambar italic not-italic">abierta</em>.
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                No hace falta cita ni escribir antes. Puedes pasar, preguntar lo
                que sea, y decidir después si quieres contarlo todo.
              </p>
            </div>

            <div className="border-t border-white/20 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
              <dl>
                {consejera?.contacto.oficina ? (
                  <div className="mb-5">
                    <dt className="text-ambar text-xs font-semibold tracking-[0.18em] uppercase">
                      Dónde
                    </dt>
                    <dd className="mt-1.5 text-lg">
                      {consejera.contacto.oficina}
                    </dd>
                  </div>
                ) : null}
                {consejera?.contacto.horario ? (
                  <div className="mb-5">
                    <dt className="text-ambar text-xs font-semibold tracking-[0.18em] uppercase">
                      Cuándo
                    </dt>
                    <dd className="mt-1.5 text-lg">
                      {consejera.contacto.horario}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <Link
                href="/calendario"
                className="bg-ambar text-tinta inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
              >
                Ver qué días está libre
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pie editorial ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="text-tinta flex items-center gap-2.5">
              <Sello className="text-azul-700 h-5 w-5" />
              <span className="font-titulo text-lg font-bold">
                Consejería Escolar
              </span>
            </p>
            <p className="text-gris mt-4 max-w-xs text-sm leading-relaxed">
              La oficina de consejería de la Escuela Superior [Nombre]. Guías,
              anuncios y el equipo que trabaja contigo — en un sitio que no te
              pide nada a cambio.
            </p>
          </div>

          {COLUMNAS.map((c) => (
            <div key={c.titulo}>
              <h2 className="text-tinta text-xs font-semibold tracking-[0.18em] uppercase">
                {c.titulo}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {c.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="text-gris hover:text-azul-700 rounded text-sm underline-offset-4 hover:underline"
                    >
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-tinta/15 text-gris mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs">
          <p>© 2026 Consejería Escolar · Escuela Superior [Nombre]</p>
          <p>Este sitio no recoge datos personales.</p>
        </div>
      </div>
    </footer>
  );
}
