import Link from 'next/link';
import type { Portada } from '@/lib/tipos';
import { Sello } from './Sello';
import { Maceta, IconoLugar, IconoCalendario } from './Ilustraciones';

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

/**
 * Pie del sitio.
 *
 * La onda de arriba es un SVG con `preserveAspectRatio="none"`: se estira a lo
 * ancho que haga falta y siempre mide 3 rem de alto, así que separa el pie del
 * contenido sin depender de una imagen ni de un ancho concreto.
 *
 * NOTA sobre los botones redondos: la maqueta traía un icono de Instagram.
 * Aquí no hay ninguno, porque la oficina no tiene redes sociales confirmadas
 * y PRODUCT.md prohíbe inventar canales. Los dos que quedan llevan a sitios
 * que existen de verdad.
 */
/**
 * El pie recibe el texto por props y NO lo lee él mismo.
 *
 * Podría leerlo: es un componente de servidor. Pero entonces el editor de la
 * portada —que es de cliente— no podría montarlo para editarlo encima, y el
 * párrafo del pie acabaría en un formulario, en una pantalla donde el pie no
 * se ve. Recibiéndolo por props, el editor le pasa su estado en vivo y el pie
 * se escribe en su sitio, igual que el resto de la portada.
 *
 * `campo` es el mismo gancho que usa <Inicio>: sin él devuelve el texto tal
 * cual y el HTML público no gana ni un nodo.
 */
export function PiePagina({
  portada,
  campo,
}: {
  portada: Portada;
  campo?: (clave: string, valor: string) => React.ReactNode;
}) {
  const escribir = campo ?? ((_c: string, v: string) => v);

  return (
    <footer className="mt-24">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden
        className="text-crema block h-12 w-full"
      >
        <path
          d="M0 20c180 28 360 28 540 12S900-8 1080 6s240 26 360 30v12H0z"
          fill="currentColor"
        />
      </svg>

      <div className="bg-crema">
        <div className="contenedor relative py-14">
          <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
            <div>
              <p className="text-tinta flex items-center gap-3">
                <Sello className="text-azul-700 h-7 w-7" />
                <span className="font-titulo text-xl font-bold">
                  Consejería Escolar
                </span>
              </p>
              <p className="text-gris mt-4 max-w-xs leading-relaxed">
                {escribir('piePagina', portada.piePagina)}
              </p>

              <ul className="mt-6 flex gap-3">
                <li>
                  <Link
                    href="/calendario"
                    className="bg-azul-100 text-azul-900 hover:bg-azul-700 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-white"
                  >
                    <IconoLugar className="h-5 w-5" />
                    <span className="sr-only">Dónde y cuándo encontrarnos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consejered"
                    className="bg-azul-100 text-azul-900 hover:bg-azul-700 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-white"
                  >
                    <IconoCalendario className="h-5 w-5" />
                    <span className="sr-only">El equipo de la oficina</span>
                  </Link>
                </li>
              </ul>
            </div>

            {COLUMNAS.map((c) => (
              <div key={c.titulo}>
                <h2 className="text-tinta text-xs font-semibold tracking-[0.18em] uppercase">
                  {c.titulo}
                </h2>
                <ul className="mt-5 space-y-3">
                  {c.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link
                        href={e.href}
                        className="barrido text-gris hover:text-azul-700 rounded"
                      >
                        {e.texto}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Maceta className="pointer-events-none absolute right-6 -bottom-1 hidden h-40 w-auto lg:block" />
        </div>
      </div>

      <div className="bg-azul-900 text-white/85">
        <div className="contenedor flex flex-wrap items-center justify-between gap-3 py-5 text-sm">
          {/* El nombre de la escuela sale del MISMO campo que la portada.
              Antes estaba escrito a mano aquí y en la cejilla de arriba, así
              que cambiarlo en el panel lo cambiaba en un sitio y en el otro
              seguía poniendo «[Nombre]», sin ninguna pista de por qué. */}
          <p>© 2026 Consejería Escolar · {portada.escuela}</p>
          <p className="flex items-center gap-2.5">
            Este sitio no recoge datos personales.
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
              <path
                d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3z"
                fill="var(--color-rosa-500)"
              />
            </svg>
          </p>
        </div>
      </div>
    </footer>
  );
}
