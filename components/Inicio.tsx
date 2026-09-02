'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { AvatarGuia, type Pose } from './AvatarGuia';
import { BurbujaDialogo } from './BurbujaDialogo';
import { useRol } from './ProveedorRol';
import { ORDEN_SECCIONES, type ClaveSeccion, type Rol } from '@/lib/rol';
import { coincide } from '@/lib/busqueda';
import { BANDA_ACENTO, type Acento } from './ui/Tarjeta';

export type Vistas = {
  guias: { pregunta: string; slug: string }[];
  noticias: { titulo: string; fecha: string; slug: string }[];
  ultimaEdicion: string | null;
  consejered: { nombre: string; puesto: string }[];
  totalPerfiles: number;
};

/**
 * La portada como "la puerta de la oficina" (doc 03 §1).
 *
 * Una sola cosa es la principal: la pregunta. Quien llega tiene treinta
 * segundos y una duda; el buscador está arriba y las tres secciones debajo
 * son lo que se hace cuando la búsqueda no alcanza. Nada de tres tarjetas
 * iguales: cada sección es una fila de un índice, con su número, su color
 * en el borde y su contenido real dentro del enlace.
 */

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
    titulo: 'Profesionales',
    href: '/consejered',
    acento: 'naranja',
    verbo: 'Conocer al equipo',
  },
};

const SALUDO: Record<Rol, string> = {
  estudiante: '¿Qué necesitas saber hoy?',
  encargado: '¿Qué necesita saber su familia hoy?',
  invitado: '¿Qué necesitas saber hoy?',
};

/**
 * La lente en una frase (doc 06 §1).
 *
 * El mismo destino, descrito según quién pregunta. Un estudiante llega con
 * una duda concreta; un encargado llega a enterarse de lo que pasa. Decirles
 * lo mismo a los dos desperdicia la única pregunta que hizo el sitio.
 */
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

// Las secciones ahora van una debajo de otra, a la izquierda del avatar. Con
// cualquiera enfocada el brazo señala hacia abajo-izquierda (hacia el índice);
// la burbuja es la que dice cuál. Sin foco, brazo en reposo.
const POSES: Pose[] = ['izquierda', 'izquierda', 'izquierda'];

export function Inicio({ vistas }: { vistas: Vistas }) {
  const { rol, nombre } = useRol();
  const [activa, setActiva] = useState<number | null>(null);

  const rolEfectivo: Rol = rol ?? 'invitado';
  // El saludo usa el primer nombre («Hola, Ana»), no el nombre completo:
  // es lo que diría la consejera al ver a alguien en la puerta.
  const primerNombre = nombre?.split(/\s+/)[0] ?? null;
  const orden = ORDEN_SECCIONES[rolEfectivo];
  const pose: Pose = activa === null ? 'neutral' : (POSES[activa] ?? 'neutral');
  const claveActiva = activa === null ? null : orden[activa];
  const textoBurbuja = claveActiva
    ? BURBUJA[claveActiva][rolEfectivo]
    : 'Bienvenidos. Escribe una palabra o baja a ver las tres secciones.';

  return (
    <div className="overflow-x-clip">
      {/* ── 1. Campo de color: la pared de la oficina ─────────────────────
          Un solo color grande, tinta encima (13.8:1). Es lo primero que se
          ve y lo único que se recuerda. */}
      <section className="bg-ambar text-tinta relative">
        <div className="mx-auto grid max-w-6xl gap-x-8 px-5 pt-10 md:grid-cols-[1fr_16rem] md:pt-16 lg:grid-cols-[1fr_20rem]">
          <div className="pb-10 md:pb-16">
            <p className="text-tinta/70 text-sm font-semibold tracking-[0.18em] uppercase">
              {primerNombre ? `Hola, ${primerNombre} · ` : ''}Oficina de
              Consejería · Escuela Superior [Nombre]
            </p>

            <h1
              className="font-titulo mt-5 text-[2.9rem] leading-[0.95] font-bold tracking-[-0.03em] sm:text-6xl lg:text-[5.25rem]"
              style={{
                fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 144",
              }}
            >
              {SALUDO[rolEfectivo]}
            </h1>

            <Buscador preguntas={vistas.guias} />

            <p className="mt-6 max-w-xl text-lg leading-snug">
              Sra. [Nombre Apellido], consejera escolar. Guías en video,
              anuncios de la escuela y el equipo que trabaja contigo.
            </p>
          </div>

          {/* La persona que recibe en la puerta: con los pies en la raya del
              suelo. La burbuja está atada al avatar, no flotando en el centro
              de la página, y se ve también en móvil. */}
          <div className="relative flex items-end justify-center md:justify-end">
            <div className="absolute top-0 right-0 left-0 z-10 md:-top-8 md:-left-24">
              <BurbujaDialogo key={textoBurbuja} texto={textoBurbuja} />
            </div>
            <AvatarGuia
              pose={pose}
              className="mt-24 h-52 w-auto md:mt-0 md:h-72 lg:h-80"
            />
          </div>
        </div>
        {/* La raya del suelo. Un borde duro, no una sombra. */}
        <div aria-hidden className="bg-tinta h-1" />
      </section>

      {/* ── 2. Índice de la oficina ──────────────────────────────────────
          Tres filas: número grande, color del cajón, título, contenido real,
          verbo. Rayas finas entre ellas, sin cajas. */}
      <section
        aria-label="Secciones del sitio"
        className="mx-auto max-w-6xl px-5"
      >
        <ol className="divide-tinta/15 divide-y">
          {orden.map((clave, i) => {
            const s = SECCIONES[clave];
            const enfocada = activa === i;
            return (
              <li key={clave}>
                <Link
                  href={s.href}
                  onMouseEnter={() => setActiva(i)}
                  onMouseLeave={() => setActiva(null)}
                  // El foco de teclado mueve el brazo igual que el ratón.
                  onFocus={() => setActiva(i)}
                  onBlur={() => setActiva(null)}
                  className="group grid gap-x-6 gap-y-3 py-8 sm:grid-cols-[4.5rem_1fr_auto] md:py-10"
                >
                  <div className="flex items-start gap-3 sm:block">
                    <span
                      aria-hidden
                      className={`block h-14 w-2.5 ${BANDA_ACENTO[s.acento]} sm:mb-3 sm:h-2.5 sm:w-14`}
                    />
                    <span
                      className="font-titulo text-tinta text-4xl leading-none font-bold tabular-nums"
                      style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2
                      className={`font-titulo text-3xl leading-tight font-bold tracking-tight transition-colors sm:text-4xl ${
                        enfocada ? 'text-azul-700' : 'text-tinta'
                      }`}
                    >
                      {s.titulo}
                    </h2>
                    <p className="text-gris mt-1.5 text-base">
                      {BURBUJA[clave][rolEfectivo]}
                    </p>
                    <div className="mt-4">
                      <VistaPrevia clave={clave} vistas={vistas} />
                    </div>
                  </div>

                  <span className="text-azul-700 flex items-center gap-2 self-start font-semibold sm:pt-2">
                    {s.verbo}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/**
 * El buscador es la acción principal de la portada. Reutiliza la lógica de
 * /guias (lib/busqueda: ignora tildes) sobre la lista completa de preguntas;
 * los resultados aparecen aquí mismo y cada uno lleva a su guía.
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
    <div className="mt-8 max-w-2xl">
      <label htmlFor={id} className="sr-only">
        Buscar una pregunta
      </label>
      {/* Una raya gruesa en vez de una caja: el campo es parte del titular,
          no un formulario pegado debajo. Al enfocar, la raya se vuelve azul
          (además del aro de foco global). */}
      <div className="border-tinta focus-within:border-azul-700 flex items-center border-b-[3px] transition-colors">
        <input
          id={id}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="matrícula, becas, ansiedad…"
          autoComplete="off"
          aria-describedby={`${id}-estado`}
          className="text-tinta placeholder:text-tinta/50 min-h-14 w-full bg-transparent text-xl sm:text-2xl"
        />
        <Link
          href="/guias"
          className="text-tinta hover:text-azul-700 shrink-0 px-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <p
        id={`${id}-estado`}
        role="status"
        className="text-tinta/75 mt-2 min-h-5 text-sm"
      >
        {buscando
          ? resultados.length === 0
            ? 'Nada con esa palabra. Prueba otra, o abre las guías completas.'
            : `${resultados.length} ${resultados.length === 1 ? 'guía' : 'guías'}`
          : `${preguntas.length} preguntas respondidas por el equipo.`}
      </p>

      {resultados.length > 0 ? (
        <ul className="bg-papel text-tinta border-tinta divide-tinta/15 mt-3 divide-y border-2 shadow-[6px_6px_0_var(--color-tinta)]">
          {resultados.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/guias/${r.slug}`}
                className="hover:bg-azul-100 flex items-center justify-between gap-4 px-4 py-3 font-medium"
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

function VistaPrevia({
  clave,
  vistas,
}: {
  clave: ClaveSeccion;
  vistas: Vistas;
}) {
  // Contenido real, completo (sin truncate) y con estado vacío escrito. Los
  // anuncios caducan solos por diseño, así que "no hay" es un estado normal
  // de julio, no un error.
  if (clave === 'guias') {
    if (vistas.guias.length === 0) {
      return <Vacio texto="Las primeras guías están en camino." />;
    }
    return (
      <ul className="text-tinta flex flex-wrap gap-2 text-sm">
        {vistas.guias.slice(0, 3).map((g) => (
          <li
            key={g.slug}
            className="border-tinta/25 bg-papel border px-3 py-1 leading-snug"
          >
            {g.pregunta}
          </li>
        ))}
        {vistas.guias.length > 3 ? (
          <li className="text-gris px-1 py-1">
            y {vistas.guias.length - 3} más
          </li>
        ) : null}
      </ul>
    );
  }
  if (clave === 'noticias') {
    if (vistas.noticias.length === 0) {
      return (
        <Vacio texto="No hay anuncios nuevos ahora mismo. Vuelve pronto." />
      );
    }
    return (
      <div className="text-tinta text-sm">
        {vistas.ultimaEdicion ? (
          <p className="text-gris mb-2 tracking-wide uppercase">
            Última edición · {vistas.ultimaEdicion}
          </p>
        ) : null}
        <ul className="space-y-1.5">
          {vistas.noticias.map((n) => (
            <li key={n.slug} className="flex gap-3 leading-snug">
              <span className="text-gris shrink-0 tabular-nums">{n.fecha}</span>
              <span className="font-medium">{n.titulo}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (vistas.consejered.length === 0) {
    return <Vacio texto="Los perfiles del equipo se publican pronto." />;
  }
  return (
    <ul className="text-tinta space-y-1 text-sm">
      {vistas.consejered.map((p) => (
        <li key={p.nombre} className="leading-snug">
          <span className="font-medium">{p.nombre}</span>
          <span className="text-gris"> — {p.puesto}</span>
        </li>
      ))}
      {vistas.totalPerfiles > vistas.consejered.length ? (
        <li className="text-gris">
          y {vistas.totalPerfiles - vistas.consejered.length} más
        </li>
      ) : null}
    </ul>
  );
}

function Vacio({ texto }: { texto: string }) {
  return <p className="text-gris text-sm italic">{texto}</p>;
}
