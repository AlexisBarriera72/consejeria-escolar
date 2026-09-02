import Link from 'next/link';
import { Sello } from './Sello';

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

export function PiePagina() {
  return (
    <footer className="mt-24">
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
