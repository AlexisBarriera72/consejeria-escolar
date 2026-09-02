'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sello, SelloMini } from './Sello';
import {
  IconoCalendario,
  IconoLugar,
  IconoLupa,
  IconoReloj,
  Megafono,
  Subrayado,
} from './Ilustraciones';
import { useRol } from './ProveedorRol';
import { ORDEN_SECCIONES, type ClaveSeccion, type Rol } from '@/lib/rol';
import { coincide } from '@/lib/busqueda';
import { BANDA_ACENTO, type Acento } from './ui/Tarjeta';

export type Vistas = {
  guias: { pregunta: string; slug: string }[];
  destacada: {
    titulo: string;
    bajada: string | null;
    fecha: string;
    slug: string;
    etiqueta: string | null;
  } | null;
  contacto: { oficina: string | null; horario: string | null } | null;
};

const SECCIONES: Record<
  ClaveSeccion,
  { titulo: string; href: string; acento: Acento; verbo: string }
> = {
  guias: {
    titulo: 'Preguntas y Guías',
    href: '/guias',
    acento: 'turquesa',
    verbo: 'Abrir el archivador',
  },
  noticias: {
    titulo: 'Noticias',
    href: '/noticias',
    acento: 'rosa',
    verbo: 'Leer el tablón',
  },
  consejered: {
    titulo: 'El equipo',
    href: '/consejered',
    acento: 'naranja',
    verbo: 'Conocer al equipo',
  },
};

const BURBUJA: Record<ClaveSeccion, Record<Rol, string>> = {
  guias: {
    estudiante:
      'Respuestas a lo que casi todo el mundo pregunta, sin tener que preguntar.',
    encargado: 'Requisitos, becas y trámites explicados paso a paso.',
    invitado: 'Respuestas cortas a las preguntas más comunes.',
  },
  noticias: {
    estudiante: 'Lo que está pasando en la escuela esta semana.',
    encargado: 'Anuncios y avisos importantes de la escuela.',
    invitado: 'Los anuncios más recientes de la escuela.',
  },
  consejered: {
    estudiante: 'Quiénes somos y dónde encontrarnos.',
    encargado: 'El equipo de apoyo y cómo contactarlo.',
    invitado: 'El equipo de la oficina de consejería.',
  },
};

export function Inicio({ vistas }: { vistas: Vistas }) {
  const { rol, nombre } = useRol();

  const rolEfectivo: Rol = rol ?? 'invitado';
  const primerNombre = nombre?.split(/\s+/)[0] ?? null;
  const orden = ORDEN_SECCIONES[rolEfectivo];

  return (
    <div className="overflow-x-clip">
      {/* ══ Lo primero es elegir a dónde ir ═══════════════════════════════ */}
      <section className="contenedor pt-10 pb-14 md:pt-14">
        {/* El texto, centrado y sin nada que le dispute el sitio. El avatar y
            su burbuja salieron de aquí: el hover que movía el brazo era la
            única razón de que esta fila fuera un flex de dos columnas. */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-gris flex items-center justify-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase">
            <SelloMini className="text-coral-700" />
            {primerNombre ? `Hola, ${primerNombre}` : 'Oficina de Consejería'}
            <span aria-hidden className="opacity-40">
              ·
            </span>
            Escuela Superior [Nombre]
          </p>

          <h1 className="font-titulo text-tinta mt-4 text-[3.4rem] leading-[0.94] font-bold tracking-[-0.035em] sm:text-[4.5rem] lg:text-[5.5rem]">
            Por dónde{' '}
            {/* El subrayado se ancla a la palabra, no al titular: si el texto
                cambia de largo o salta de línea, el trazo lo sigue. */}
            <span className="relative inline-block">
              <em className="text-azul-700 italic">empezar</em>
              <Subrayado className="text-ambar absolute -bottom-1.5 left-0 h-3 w-full" />
            </span>
            .
          </h1>

          <p className="text-gris mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed">
            Sra. [Nombre Apellido], consejera escolar. Tres sitios, y en
            cualquiera de ellos puedes mirar sin decir quién eres.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {orden.map((clave, i) => {
            const s = SECCIONES[clave];
            return (
              <li key={clave}>
                <Link
                  href={s.href}
                  className={`group text-tinta relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-transform hover:-translate-y-1 ${BANDA_ACENTO[s.acento]}`}
                >
                  <Sello
                    petalos={12}
                    giro={i * 15}
                    className="text-tinta/10 pointer-events-none absolute -right-14 -bottom-16 h-52 w-52"
                  />
                  <span
                    aria-hidden
                    className="font-titulo relative text-sm font-bold tabular-nums opacity-70"
                  >
                    0{i + 1}
                  </span>

                  <h2 className="font-titulo relative mt-6 text-3xl leading-[1.08] font-bold tracking-[-0.015em]">
                    {s.titulo}
                  </h2>
                  <p className="relative mt-2.5 leading-snug">
                    {BURBUJA[clave][rolEfectivo]}
                  </p>

                  <p className="border-tinta/20 relative mt-auto flex items-center gap-2 border-t pt-5 text-sm font-semibold">
                    {s.verbo}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ Al fondo: lo último y la puerta, uno al lado del otro ═════════ */}
      <section className="contenedor pb-4">
        <div className="grid gap-5 lg:grid-cols-2">
          {vistas.destacada ? (
            /*
              La pieza del megáfono viene como TARJETA, no como recorte: es un
              rectángulo azul opaco con el megáfono abajo a la derecha y el
              resto liso para poner texto encima. Así que se usa tal cual, de
              fondo con `cover` anclado abajo a la derecha — el megáfono
              sobrevive a cualquier recorte y el azul liso rellena el resto.
              El color de respaldo es el mismo azul del archivo (#123f84), no
              azul-900, para que no se vea el canto si la imagen tarda.
              Blanco sobre ese azul mide 10.14:1.
            */
            <Link
              href={`/noticias/${vistas.destacada.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#113d82] p-8 text-white"
              style={{
                backgroundImage: "url('/megafono.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'right bottom',
              }}
            >
              <div className="relative max-w-sm">
                <p className="text-ambar text-xs font-semibold tracking-[0.16em] uppercase">
                  Lo más reciente
                </p>
                <h2 className="font-titulo mt-4 text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
                  {vistas.destacada.titulo}
                </h2>
                {vistas.destacada.bajada ? (
                  <p className="mt-3 leading-relaxed text-white/85">
                    {vistas.destacada.bajada}
                  </p>
                ) : null}
              </div>
              <div className="relative mt-8 flex flex-wrap items-center gap-4">
                {vistas.destacada.etiqueta ? (
                  <span className="bg-ambar text-tinta rounded-full px-4 py-1.5 text-sm font-semibold">
                    {vistas.destacada.etiqueta}
                  </span>
                ) : null}
                <span className="flex items-center gap-2 text-sm text-white/80">
                  <IconoCalendario className="h-4 w-4" />
                  {vistas.destacada.fecha}
                </span>
              </div>
            </Link>
          ) : (
            <div className="bg-azul-100 flex flex-col items-center justify-center rounded-3xl p-10 text-center">
              <Megafono className="h-24 w-auto opacity-60" />
              <p className="text-gris mt-4 max-w-xs">
                Todavía no hay anuncios. Cuando la oficina publique el primero,
                aparecerá aquí.
              </p>
            </div>
          )}

          {/* La puerta abierta. Antes vivía en el pie de TODAS las páginas;
              aquí cierra la portada con lo único que de verdad hace falta
              saber para pasar por la oficina: dónde y cuándo. */}
          <div className="bg-crema border-tinta/10 relative overflow-hidden rounded-3xl border p-8">
            <Image
              src="/puerta.webp"
              alt=""
              width={416}
              height={386}
              className="pointer-events-none absolute right-2 bottom-2 hidden h-56 w-auto sm:block lg:h-64"
            />
            <div className="relative max-w-sm">
              <h2 className="font-titulo text-tinta text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
                La puerta está <em className="text-azul-700 italic">abierta</em>
                .
              </h2>
              <p className="text-gris mt-3 leading-relaxed">
                No hace falta cita ni escribir antes. Puedes pasar, preguntar lo
                que sea, y decidir después si quieres contarlo todo.
              </p>

              {vistas.contacto?.oficina || vistas.contacto?.horario ? (
                <dl className="border-tinta/15 mt-6 space-y-4 border-t pt-5">
                  {/* Rejilla, no divs anidados. Un <dl> admite dt/dd dentro de
                      UN <div>, pero no dos niveles abajo: axe lo marca como
                      grave. El icono ocupa las dos filas de la columna
                      izquierda y queda como hermano del dt y el dd. */}
                  {vistas.contacto.oficina ? (
                    <div className="grid grid-cols-[auto_1fr] items-start gap-x-3">
                      <IconoLugar className="text-azul-700 row-span-2 mt-0.5 h-5 w-5" />
                      <dt className="text-azul-700 text-xs font-semibold tracking-[0.16em] uppercase">
                        Dónde
                      </dt>
                      <dd className="text-tinta mt-0.5">
                        {vistas.contacto.oficina}
                      </dd>
                    </div>
                  ) : null}
                  {vistas.contacto.horario ? (
                    <div className="grid grid-cols-[auto_1fr] items-start gap-x-3">
                      <IconoReloj className="text-azul-700 row-span-2 mt-0.5 h-5 w-5" />
                      <dt className="text-azul-700 text-xs font-semibold tracking-[0.16em] uppercase">
                        Cuándo
                      </dt>
                      <dd className="text-tinta mt-0.5">
                        {vistas.contacto.horario}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              <Link
                href="/calendario"
                className="bg-ambar text-tinta hover:bg-amarillo mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition-colors"
              >
                Ver qué días está libre
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ El atajo, justo antes del pie ════════════════════════════════ */}
      <Buscador preguntas={vistas.guias} />
    </div>
  );
}

/**
 * El buscador va DESPUÉS de las tarjetas: primero se elige a dónde ir, y esto
 * es el atajo para quien ya sabe qué busca. Reutiliza lib/busqueda, que
 * ignora tildes pero conserva la ñ.
 */
/**
 * El atajo del final: quien ya sabe qué busca no debería tener que entrar a
 * /guias y buscar allí. Reutiliza lib/busqueda, que ignora tildes pero
 * conserva la ñ.
 *
 * El botón "Buscar" hace algo de verdad. Los resultados aparecen solos según
 * escribes, así que un botón decorativo habría sido una mentira pequeña:
 * envía a /guias, que es donde está la búsqueda completa con el texto de las
 * respuestas incluido, no solo los títulos.
 */
function Buscador({
  preguntas,
}: {
  preguntas: { pregunta: string; slug: string }[];
}) {
  const [consulta, setConsulta] = useState('');
  const id = useId();
  const router = useRouter();
  const buscando = consulta.trim().length > 0;

  const resultados = useMemo(
    () =>
      buscando
        ? preguntas.filter((p) => coincide(consulta, p.pregunta)).slice(0, 5)
        : [],
    [preguntas, consulta, buscando],
  );

  return (
    <section className="contenedor mt-16 pb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push('/guias');
        }}
        className="bg-ambar/20 border-ambar/45 relative flex flex-wrap items-center gap-5 overflow-hidden rounded-3xl border px-6 py-6 sm:px-8"
      >
        <span
          aria-hidden
          className="bg-ambar text-tinta flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        >
          <IconoLupa className="h-6 w-6" />
        </span>

        <div className="min-w-56 flex-1">
          <label
            htmlFor={id}
            className="text-gris text-xs font-semibold tracking-[0.16em] uppercase"
          >
            ¿Ya sabes qué buscas?
          </label>
          <input
            id={id}
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="matrícula, becas, ansiedad…"
            autoComplete="off"
            aria-describedby={`${id}-estado`}
            className="text-tinta placeholder:text-tinta/45 border-tinta/35 focus:border-coral-700 mt-1 min-h-11 w-full border-b bg-transparent text-lg transition-colors"
          />
        </div>

        <button
          type="submit"
          className="bg-azul-900 hover:bg-azul-700 shrink-0 rounded-full px-7 py-3 font-semibold text-white transition-colors"
        >
          Buscar
        </button>

        <Image
          src="/libros.webp"
          alt=""
          width={418}
          height={298}
          className="pointer-events-none hidden h-24 w-auto shrink-0 lg:block"
        />
      </form>

      <p
        id={`${id}-estado`}
        role="status"
        className="text-gris mt-3 min-h-5 text-sm"
      >
        {buscando
          ? resultados.length === 0
            ? 'Nada con esa palabra. Prueba otra, o abre las guías completas.'
            : `${resultados.length} ${resultados.length === 1 ? 'guía' : 'guías'}`
          : ''}
      </p>

      {resultados.length > 0 ? (
        <ul className="bg-crema border-tinta divide-tinta/12 mt-1 divide-y rounded-2xl border-2">
          {resultados.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/guias/${r.slug}`}
                className="text-tinta hover:bg-ambar/35 flex items-center justify-between gap-4 px-5 py-3.5 font-medium"
              >
                <span>{r.pregunta}</span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
