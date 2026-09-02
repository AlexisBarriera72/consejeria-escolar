import Link from 'next/link';
import { ChipRol } from './ChipRol';
import { BotonCalma } from './BotonCalma';
import { Sello } from './Sello';

const NAV = [
  { href: '/guias', texto: 'Guías' },
  { href: '/noticias', texto: 'Noticias' },
  { href: '/consejered', texto: 'El equipo' },
];

/**
 * Cabecera editorial sobre pergamino.
 *
 * Antes era una banda azul con texto blanco encima. Medía 4.43:1 y AA pide
 * 4.5 — y el propio `globals.css` nombraba ese color como la excepción que
 * no puede llevar blanco. Al pasar la cabecera a pergamino con tinta encima
 * el ratio sube a 14.20:1, los chips dejan de necesitar bordes translúcidos
 * (que daban 1.80:1), y de paso es lo que hace la referencia: la marca vive
 * sobre el papel, no sobre un bloque de color.
 */
export function Encabezado() {
  return (
    <header className="bg-papel border-tinta/15 border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
        <Link
          href="/"
          className="text-tinta flex shrink-0 items-center gap-2.5 rounded"
        >
          <Sello className="text-azul-700 h-6 w-6" />
          <span className="font-titulo text-lg font-bold tracking-tight">
            Consejería Escolar
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-6 hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-tinta hover:text-azul-700 rounded text-[0.95rem] font-medium underline-offset-4 hover:underline"
                >
                  {n.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <BotonCalma />
          <ChipRol />
          <Link
            href="/calendario"
            className="bg-azul-900 hidden rounded-full px-4 py-2 text-sm font-semibold text-white sm:inline-block"
          >
            Disponibilidad{' '}
            <span aria-hidden className="opacity-70">
              ↗
            </span>
          </Link>
        </div>
      </div>

      {/* En móvil la navegación baja a su propia fila: el pergamino aguanta
          una segunda línea mucho mejor que un menú escondido tras un icono. */}
      <nav aria-label="Secciones" className="md:hidden">
        <ul className="border-tinta/15 flex gap-5 overflow-x-auto border-t px-5 py-2.5">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="text-tinta rounded text-sm font-medium whitespace-nowrap"
              >
                {n.texto}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/calendario"
              className="text-azul-700 rounded text-sm font-semibold whitespace-nowrap"
            >
              Disponibilidad
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
