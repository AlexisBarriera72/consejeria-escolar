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
  categorias: {
    id: string;
    titulo: string;
    descripcion: string;
    acento: Acento;
    total: number;
  }[];
  destacada: {
    titulo: string;
    bajada: string | null;
    fecha: string;
    slug: string;
    etiqueta: string | null;
  } | null;
  ultimas: {
    titulo: string;
    fecha: string;
    slug: string;
    etiqueta: string | null;
  }[];
  equipo: { nombre: string; puesto: string; slug: string; acento: Acento }[];
  totales: {
    guias: number;
    noticias: number;
    perfiles: number;
    categorias: number;
  };
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

const SALUDO: Record<Rol, [string, string, string]> = {
  estudiante: ['¿Qué necesitas', 'saber', 'hoy?'],
  encargado: ['¿Qué necesita saber', 'su familia', 'hoy?'],
  invitado: ['¿Qué necesitas', 'saber', 'hoy?'],
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
    encargado: 'El equipo de apoyo, sus credenciales y cómo contactarlo.',
    invitado: 'El equipo de la oficina de consejería.',
  },
};

const POSES: Pose[] = ['izquierda', 'centro', 'derecha'];
const CHIP = ['bg-ambar', 'bg-coral', 'bg-azul-300', 'bg-salvia'];

export function Inicio({ vistas }: { vistas: Vistas }) {
  const { rol, nombre } = useRol();
  const [activa, setActiva] = useState<number | null>(null);

  const rolEfectivo: Rol = rol ?? 'invitado';
  const primerNombre = nombre?.split(/\s+/)[0] ?? null;
  const orden = ORDEN_SECCIONES[rolEfectivo];
  const pose: Pose = activa === null ? 'neutral' : (POSES[activa] ?? 'neutral');
  const claveActiva = activa === null ? null : orden[activa];
  const [ini, medio, fin] = SALUDO[rolEfectivo];

  return (
    <div className="overflow-x-clip">
      {/* ══ 1. Portada ══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="text-gris flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase">
              <SelloMini className="text-ambar" />
              {primerNombre ? `Hola, ${primerNombre}` : 'Oficina de Consejería'}
              <span aria-hidden className="opacity-40">
                ·
              </span>
              Escuela Superior [Nombre]
            </p>

            {/* El titular de la referencia: enorme, interlineado por debajo
                de 1, y UNA palabra en cursiva y color. Los ejes SOFT y WONK
                de Fraunces son los que le dan el carácter editorial. */}
            <h1
              className="font-titulo text-tinta mt-6 text-[3.1rem] leading-[0.93] font-bold tracking-[-0.035em] sm:text-7xl lg:text-[5.5rem]"
              style={{
                fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144",
              }}
            >
              {ini} <em className="text-coral-700 italic">{medio}</em> {fin}
            </h1>

            <Buscador preguntas={vistas.guias} />

            <p className="text-gris mt-7 max-w-lg text-lg leading-relaxed">
              Sra. [Nombre Apellido], consejera escolar. Guías en video,
              anuncios de la escuela, y el equipo que trabaja contigo. Sin
              cuentas, sin correos, sin pedirte nada.
            </p>

            {/* Cifras reales del contenido, con rayas finas entre ellas. */}
            <dl className="border-tinta/15 mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t pt-7">
              {[
                [vistas.totales.guias, 'preguntas respondidas'],
                [vistas.totales.noticias, 'anuncios publicados'],
                [vistas.totales.perfiles, 'personas en el equipo'],
              ].map(([n, etiqueta]) => (
                <div key={String(etiqueta)}>
                  <dt className="sr-only">{etiqueta}</dt>
                  <dd>
                    <span
                      className="font-titulo text-tinta block text-4xl leading-none font-bold tabular-nums"
                      style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                    >
                      {String(n).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden
                      className="text-gris mt-1.5 block text-xs font-semibold tracking-[0.14em] uppercase"
                    >
                      {etiqueta}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* La "portada del número" de la referencia: el anuncio más
              reciente, en un bloque oscuro con marca de agua. */}
          {vistas.destacada ? (
            <Link
              href={`/noticias/${vistas.destacada.slug}`}
              className="group bg-azul-900 relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 text-white lg:min-h-[26rem]"
            >
              <Sello
                petalos={13}
                className="pointer-events-none absolute -right-20 -bottom-24 h-72 w-72 text-white/10 transition-transform duration-500 group-hover:rotate-12"
              />
              <div className="relative">
                <p className="text-ambar text-xs font-semibold tracking-[0.18em] uppercase">
                  Lo más reciente
                </p>
                <h2
                  className="font-titulo mt-5 text-4xl leading-[1.02] font-bold tracking-[-0.02em] lg:text-5xl"
                  style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                >
                  {vistas.destacada.titulo}
                </h2>
                {vistas.destacada.bajada ? (
                  <p className="mt-4 max-w-sm leading-relaxed text-white/80">
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
                <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-transform group-hover:translate-x-1">
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ) : (
            <div className="border-tinta/45 text-gris flex min-h-[22rem] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
              <Sello className="text-tinta/15 h-16 w-16" />
              <p className="mt-4 max-w-xs">
                Todavía no hay anuncios. Cuando la oficina publique el primero,
                aparecerá aquí.
              </p>
            </div>
          )}
        </div>

        {/* Fila de temas — las "reading lines" de la referencia. */}
        {vistas.categorias.length > 0 ? (
          <div className="border-tinta/15 mt-14 flex flex-wrap items-center gap-3 border-t pt-7">
            <span className="text-gris text-xs font-semibold tracking-[0.18em] uppercase">
              Temas
            </span>
            {vistas.categorias.map((c) => (
              <Link
                key={c.id}
                href="/guias"
                className={`text-tinta rounded-full px-4 py-1.5 text-sm font-medium ${BANDA_ACENTO[c.acento]}`}
              >
                {c.titulo}
              </Link>
            ))}
            <Link
              href="/guias"
              className="border-tinta/55 text-tinta hover:bg-tinta rounded-full border px-4 py-1.5 text-sm font-medium hover:text-white"
            >
              Ver todas
            </Link>
          </div>
        ) : null}
      </section>

      {/* ══ 2. Por dónde empezar — el avatar señala ═════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            className="font-titulo text-tinta max-w-lg text-4xl leading-[1.02] font-bold tracking-[-0.03em] sm:text-5xl"
            style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
          >
            Por dónde <em className="text-azul-700 italic">empezar</em>.
          </h2>

          {/* El avatar conserva su trabajo original — señalar las tres
              secciones — pero una pantalla más abajo, donde ya no le cuesta
              el primer golpe de vista a nadie. */}
          <div className="relative hidden shrink-0 items-end gap-4 md:flex">
            <div className="w-64">
              <BurbujaDialogo
                key={claveActiva ?? 'reposo'}
                texto={
                  claveActiva
                    ? BURBUJA[claveActiva][rolEfectivo]
                    : 'Pasa por encima de una y te cuento qué hay dentro.'
                }
              />
            </div>
            <AvatarGuia pose={pose} className="h-32 w-auto lg:h-40" />
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
                  className={`group text-tinta relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-transform hover:-translate-y-1 ${BANDA_ACENTO[s.acento]}`}
                >
                  <Sello
                    petalos={12}
                    giro={i * 15}
                    className="text-tinta/10 pointer-events-none absolute -right-12 -bottom-16 h-56 w-56"
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="bg-tinta/10 flex h-11 w-11 items-center justify-center rounded-full">
                      <Sello className="h-5 w-5" />
                    </span>
                    <span
                      className="font-titulo text-2xl font-bold tabular-nums opacity-60"
                      style={{ fontVariationSettings: "'WONK' 1" }}
                    >
                      N° 0{i + 1}
                    </span>
                  </div>

                  <h3
                    className="font-titulo relative mt-8 text-3xl leading-[1.05] font-bold tracking-[-0.02em]"
                    style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                  >
                    {s.titulo}
                  </h3>
                  <p className="relative mt-3 leading-snug">
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

      {/* ══ 3. Banda oscura ════════════════════════════════════════════ */}
      <section className="bg-azul-900 relative overflow-hidden py-20 text-white">
        <Sello
          petalos={15}
          className="pointer-events-none absolute -top-32 -left-24 h-[30rem] w-[30rem] text-white/[0.07]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2
            className="font-titulo text-5xl leading-[0.98] font-bold tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]"
            style={{
              fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144",
            }}
          >
            Nadie debería tener que adivinar{' '}
            <em className="text-ambar italic">a quién</em> preguntar.
          </h2>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-8">
            {[
              [vistas.totales.guias, 'guías escritas'],
              [vistas.totales.categorias, 'temas cubiertos'],
              [vistas.totales.noticias, 'anuncios'],
              [vistas.totales.perfiles, 'del equipo'],
            ].map(([n, etiqueta]) => (
              <div key={String(etiqueta)}>
                <dt className="sr-only">{etiqueta}</dt>
                <dd>
                  <span
                    className="font-titulo block text-5xl leading-none font-bold tabular-nums"
                    style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                  >
                    {String(n).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden
                    className="text-ambar mt-2 block text-xs font-semibold tracking-[0.16em] uppercase"
                  >
                    {etiqueta}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ 4. Índice editorial ════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            className="font-titulo text-tinta text-4xl leading-[1.02] font-bold tracking-[-0.03em] sm:text-5xl"
            style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
          >
            Lo último del <em className="text-rosa-700 italic">tablón</em>.
          </h2>
          <Link
            href="/noticias/archivo"
            className="text-tinta hover:text-azul-700 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Ediciones anteriores →
          </Link>
        </div>

        {vistas.ultimas.length === 0 ? (
          <p className="border-tinta/15 text-gris mt-8 border-t pt-8 italic">
            No hay anuncios ahora mismo. Los anuncios se retiran solos cuando
            pasan, así que este espacio vacío es normal fuera de temporada.
          </p>
        ) : (
          <ol className="divide-tinta/12 border-tinta/15 mt-8 divide-y border-t">
            {vistas.ultimas.map((n, i) => (
              <li key={n.slug}>
                <Link
                  href={`/noticias/${n.slug}`}
                  className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-5 py-6"
                >
                  <span
                    className={`text-tinta flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold tabular-nums ${CHIP[i % CHIP.length]}`}
                    aria-hidden
                  >
                    {String(vistas.ultimas.length - i).padStart(2, '0')}
                  </span>

                  <span className="min-w-0">
                    <span className="font-titulo text-tinta group-hover:text-azul-700 block text-xl leading-snug font-bold transition-colors sm:text-2xl">
                      {n.titulo}
                    </span>
                    <span className="text-gris mt-1.5 block text-xs font-semibold tracking-[0.12em] uppercase">
                      {n.etiqueta ? `${n.etiqueta} · ` : ''}
                      {n.fecha}
                    </span>
                  </span>

                  <span className="border-tinta/55 text-tinta group-hover:bg-tinta flex h-11 w-11 items-center justify-center rounded-full border transition-colors group-hover:text-white">
                    <span aria-hidden>↗</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ══ 5. El equipo ═══════════════════════════════════════════════ */}
      {vistas.equipo.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-8">
          <div className="border-tinta/15 flex flex-wrap items-center gap-x-8 gap-y-5 border-t pt-8">
            <p className="text-gris flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase">
              <SelloMini className="text-coral-700" />
              Quién está detrás
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {vistas.equipo.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/consejered/${p.slug}`}
                    className={`text-tinta inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm ${BANDA_ACENTO[p.acento]}`}
                  >
                    <span className="bg-tinta/15 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                      {p.nombre
                        .split(/\s+/)
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <span className="font-medium">{p.nombre}</span>
                    <span className="opacity-70">· {p.puesto}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/**
 * El buscador es la acción principal de la portada (P1 de la crítica: quien
 * llega tiene treinta segundos y una duda concreta). Reutiliza lib/busqueda,
 * que ignora tildes pero conserva la ñ.
 *
 * Es una raya gruesa, no una caja: forma parte del titular en vez de ser un
 * formulario pegado debajo.
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
    <div className="mt-9 max-w-xl">
      <label htmlFor={id} className="sr-only">
        Buscar una pregunta
      </label>
      <div className="border-tinta focus-within:border-coral-700 flex items-center border-b-[3px] transition-colors">
        <input
          id={id}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="matrícula, becas, ansiedad…"
          autoComplete="off"
          aria-describedby={`${id}-estado`}
          className="text-tinta placeholder:text-tinta/45 min-h-14 w-full bg-transparent text-xl sm:text-2xl"
        />
        <Link
          href="/guias"
          className="text-tinta hover:text-azul-700 shrink-0 px-2 text-sm font-semibold whitespace-nowrap underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <p
        id={`${id}-estado`}
        role="status"
        className="text-gris mt-2.5 min-h-5 text-sm"
      >
        {buscando
          ? resultados.length === 0
            ? 'Nada con esa palabra. Prueba otra, o abre las guías completas.'
            : `${resultados.length} ${resultados.length === 1 ? 'guía' : 'guías'}`
          : `${preguntas.length} preguntas ya respondidas por el equipo.`}
      </p>

      {resultados.length > 0 ? (
        <ul className="bg-crema border-tinta divide-tinta/12 mt-3 divide-y rounded-2xl border-2 shadow-[6px_6px_0_var(--color-tinta)]">
          {resultados.map((r) => (
            <li key={r.slug} className="first:rounded-t-2xl last:rounded-b-2xl">
              <Link
                href={`/guias/${r.slug}`}
                className="text-tinta hover:bg-ambar/35 flex items-center justify-between gap-4 px-5 py-3.5 font-medium first:rounded-t-2xl last:rounded-b-2xl"
              >
                <span>{r.pregunta}</span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
