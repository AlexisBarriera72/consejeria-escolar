'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { AvatarGuia, type Pose } from './AvatarGuia';
import { BurbujaDialogo } from './BurbujaDialogo';
import { Sello, SelloMini } from './Sello';
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

/**
 * El avatar está al final derecho de la fila, así que las tres tarjetas caen a
 * su izquierda: son tres grados de inclinación, no izquierda/centro/derecha.
 * La tarjeta 0 es la más lejana y necesita el brazo más abierto.
 */
const POSES: Pose[] = ['izquierda', 'centro', 'derecha'];

export function Inicio({ vistas }: { vistas: Vistas }) {
  const { rol, nombre } = useRol();
  const [activa, setActiva] = useState<number | null>(null);

  const rolEfectivo: Rol = rol ?? 'invitado';
  const primerNombre = nombre?.split(/\s+/)[0] ?? null;
  const orden = ORDEN_SECCIONES[rolEfectivo];
  const pose: Pose = activa === null ? 'neutral' : (POSES[activa] ?? 'neutral');
  const claveActiva = activa === null ? null : orden[activa];

  return (
    <div className="overflow-x-clip">
      {/* ══ Lo primero es elegir a dónde ir ═══════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-14 md:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="max-w-xl">
            <p className="text-gris flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase">
              <SelloMini className="text-coral-700" />
              {primerNombre ? `Hola, ${primerNombre}` : 'Oficina de Consejería'}
              <span aria-hidden className="opacity-40">
                ·
              </span>
              Escuela Superior [Nombre]
            </p>

            <h1 className="font-titulo text-tinta mt-4 text-[2.7rem] leading-[1.02] font-bold tracking-[-0.02em] sm:text-6xl">
              Por dónde <em className="text-azul-700 italic">empezar</em>.
            </h1>

            <p className="text-gris mt-5 text-lg leading-relaxed">
              Sra. [Nombre Apellido], consejera escolar. Tres sitios, y en
              cualquiera de ellos puedes mirar sin decir quién eres.
            </p>
          </div>

          {/* La burbuja va ENCIMA del avatar, con el pico apuntando a su
              cabeza. Antes iba al lado y el conjunto no se leía como que
              hablara él. */}
          <div className="hidden shrink-0 flex-col items-start md:flex">
            {/* Altura RESERVADA. El texto de la burbuja cambia de largo entre
                secciones y además se escribe letra a letra, así que su alto
                crecía línea a línea y empujaba toda la página hacia abajo en
                cada hover. Fijando la caja al alto del texto más largo, nada
                de lo que hay debajo se vuelve a mover. */}
            <div className="flex min-h-[7.5rem] w-72 items-end">
              <BurbujaDialogo
                key={claveActiva ?? 'reposo'}
                texto={
                  claveActiva
                    ? BURBUJA[claveActiva][rolEfectivo]
                    : 'Pasa por encima de una y te cuento qué hay dentro.'
                }
              />
            </div>
            <AvatarGuia pose={pose} className="mt-5 ml-2 h-36 w-auto lg:h-44" />
          </div>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {orden.map((clave, i) => {
            const s = SECCIONES[clave];
            return (
              <li key={clave}>
                <Link
                  href={s.href}
                  onMouseEnter={() => setActiva(i)}
                  onMouseLeave={() => setActiva(null)}
                  onFocus={() => setActiva(i)}
                  onBlur={() => setActiva(null)}
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
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="grid gap-5 lg:grid-cols-2">
          {vistas.destacada ? (
            <Link
              href={`/noticias/${vistas.destacada.slug}`}
              className="group bg-azul-900 relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-white"
            >
              <Sello
                petalos={13}
                className="pointer-events-none absolute -right-16 -bottom-20 h-60 w-60 text-white/10 transition-transform duration-500 group-hover:rotate-12"
              />
              <div className="relative">
                <p className="text-ambar text-xs font-semibold tracking-[0.16em] uppercase">
                  Lo más reciente
                </p>
                <h2 className="font-titulo mt-4 text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
                  {vistas.destacada.titulo}
                </h2>
                {vistas.destacada.bajada ? (
                  <p className="mt-3 max-w-sm leading-relaxed text-white/80">
                    {vistas.destacada.bajada}
                  </p>
                ) : null}
              </div>
              <div className="relative mt-8 flex flex-wrap items-center gap-3">
                {vistas.destacada.etiqueta ? (
                  <span className="bg-ambar text-tinta rounded-full px-3 py-1 text-xs font-semibold">
                    {vistas.destacada.etiqueta}
                  </span>
                ) : null}
                <span className="text-sm text-white/70">
                  {vistas.destacada.fecha}
                </span>
                <span
                  aria-hidden
                  className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ) : (
            <div className="border-tinta/25 text-gris flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
              <Sello className="text-tinta/15 h-14 w-14" />
              <p className="mt-4 max-w-xs">
                Todavía no hay anuncios. Cuando la oficina publique el primero,
                aparecerá aquí.
              </p>
            </div>
          )}

          {/* La puerta abierta: antes vivía en el pie de TODAS las páginas.
              Aquí abajo, junto a lo último, cierra la portada con lo que de
              verdad hace falta saber — dónde y cuándo. */}
          <div className="bg-azul-900 relative overflow-hidden rounded-2xl p-8 text-white">
            <Sello
              petalos={15}
              giro={20}
              className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 text-white/10"
            />
            <div className="relative">
              <h2 className="font-titulo text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
                La puerta está <em className="text-ambar italic">abierta</em>.
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-white/80">
                No hace falta cita ni escribir antes. Puedes pasar, preguntar lo
                que sea, y decidir después si quieres contarlo todo.
              </p>

              {vistas.contacto?.oficina || vistas.contacto?.horario ? (
                <dl className="mt-6 space-y-3 border-t border-white/20 pt-5">
                  {vistas.contacto.oficina ? (
                    <div>
                      <dt className="text-ambar text-xs font-semibold tracking-[0.16em] uppercase">
                        Dónde
                      </dt>
                      <dd className="mt-1">{vistas.contacto.oficina}</dd>
                    </div>
                  ) : null}
                  {vistas.contacto.horario ? (
                    <div>
                      <dt className="text-ambar text-xs font-semibold tracking-[0.16em] uppercase">
                        Cuándo
                      </dt>
                      <dd className="mt-1">{vistas.contacto.horario}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              <Link
                href="/calendario"
                className="bg-ambar text-tinta mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
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
function Buscador({
  preguntas,
}: {
  preguntas: { pregunta: string; slug: string }[];
}) {
  const [consulta, setConsulta] = useState('');
  const id = useId();
  const buscando = consulta.trim().length > 0;

  const resultados = useMemo(
    () =>
      buscando
        ? preguntas.filter((p) => coincide(consulta, p.pregunta)).slice(0, 5)
        : [],
    [preguntas, consulta, buscando],
  );

  return (
    <section className="mx-auto mt-16 max-w-2xl px-5 pb-4 text-center">
      <label
        htmlFor={id}
        className="text-gris text-xs font-semibold tracking-[0.16em] uppercase"
      >
        ¿Ya sabes qué buscas?
      </label>
      <div className="border-tinta focus-within:border-coral-700 mx-auto mt-3 flex items-center border-b-2 transition-colors">
        <input
          id={id}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="matrícula, becas, ansiedad…"
          autoComplete="off"
          aria-describedby={`${id}-estado`}
          className="text-tinta placeholder:text-tinta/45 min-h-12 w-full bg-transparent text-center text-lg"
        />
      </div>

      <p
        id={`${id}-estado`}
        role="status"
        className="text-gris mt-2 min-h-5 text-sm"
      >
        {buscando
          ? resultados.length === 0
            ? 'Nada con esa palabra. Prueba otra, o abre las guías completas.'
            : `${resultados.length} ${resultados.length === 1 ? 'guía' : 'guías'}`
          : ''}
      </p>

      {resultados.length > 0 ? (
        <ul className="bg-crema border-tinta divide-tinta/12 mt-3 divide-y rounded-xl border-2 text-left">
          {resultados.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/guias/${r.slug}`}
                className="text-tinta hover:bg-ambar/35 flex items-center justify-between gap-4 px-5 py-3 font-medium"
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
