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
import { type ClaveSeccion, type Rol } from '@/lib/rol';
import { coincide } from '@/lib/busqueda';
import { BANDA_ACENTO, type Acento } from './ui/Tarjeta';
import type { Portada } from '@/lib/tipos';

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

/** Lo que NO es texto y por tanto no se edita: a dónde va cada tarjeta y de
 *  qué color es. Cambiar eso no es escribir, es rehacer el sitio. */
const RUTA: Record<ClaveSeccion, { href: string; acento: Acento }> = {
  guias: { href: '/guias', acento: 'turquesa' },
  noticias: { href: '/noticias', acento: 'rosa' },
  consejered: { href: '/consejered', acento: 'naranja' },
};

/**
 * Ganchos de edición.
 *
 * El panel NO reimplementa la portada: monta este mismo componente y le pasa
 * estos ganchos. Es la única forma de que lo que se edita y lo que se publica
 * no se separen con el tiempo — cualquier cambio de maquetación aparece en
 * los dos sitios porque son el mismo archivo.
 *
 * Sin ganchos, `campo` devuelve el texto tal cual y no hay ni un nodo de más
 * en el HTML público.
 */
export type Ganchos = {
  /** `clave` es la ruta del dato: "lede", "secciones.0.titulo". */
  campo?: (clave: string, valor: string) => React.ReactNode;
  controlesTarjeta?: (indice: number) => React.ReactNode;
  controlesAbajo?: (cual: 'noticias' | 'puerta') => React.ReactNode;
};

export function Inicio({
  vistas,
  portada,
  ganchos,
  rolForzado,
}: {
  vistas: Vistas;
  portada: Portada;
  ganchos?: Ganchos;
  /** El editor previsualiza un rol concreto en vez del del navegador. */
  rolForzado?: Rol;
}) {
  const { rol, nombre } = useRol();

  const rolEfectivo: Rol = rolForzado ?? rol ?? 'invitado';
  const primerNombre = nombre?.split(/\s+/)[0] ?? null;
  const campo = ganchos?.campo ?? ((_clave: string, valor: string) => valor);
  // En el editor los enlaces no navegan. No es comodidad: los textos
  // editables son focusables, y un control focusable DENTRO de un <a> es un
  // fallo de accesibilidad serio además de un clic que te saca de la página
  // que estabas editando.
  const edicion = Boolean(ganchos);

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
            {/* El saludo con nombre pisa la cejilla cuando alguien lo dio.
                En el editor no hay nombre, así que siempre se ve el texto
                editable. */}
            {primerNombre
              ? `Hola, ${primerNombre}`
              : campo('cejilla', portada.cejilla)}
            <span aria-hidden className="opacity-40">
              ·
            </span>
            {campo('escuela', portada.escuela)}
          </p>

          <h1 className="font-titulo text-tinta mt-4 text-[3.4rem] leading-[0.94] font-bold tracking-[-0.035em] sm:text-[4.5rem] lg:text-[5.5rem]">
            {campo('tituloAntes', portada.tituloAntes)}{' '}
            {/* El subrayado se ancla a la palabra, no al titular: si el texto
                cambia de largo o salta de línea, el trazo lo sigue. */}
            <span className="relative inline-block">
              <em className="text-azul-700 italic">
                {campo('tituloAcento', portada.tituloAcento)}
              </em>
              <Subrayado className="text-ambar absolute -bottom-1.5 left-0 h-3 w-full" />
            </span>
            {campo('tituloDespues', portada.tituloDespues)}
          </h1>

          <p className="text-gris mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed">
            {campo('lede', portada.lede)}
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {portada.secciones.map((s, i) => {
            const r = RUTA[s.clave];
            return (
              <li key={s.clave} className="relative">
                {ganchos?.controlesTarjeta?.(i)}
                <Envoltura
                  edicion={edicion}
                  href={r.href}
                  className={`group text-tinta relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-transform hover:-translate-y-1 ${BANDA_ACENTO[r.acento]}`}
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
                    {campo(`secciones.${i}.titulo`, s.titulo)}
                  </h2>
                  <p className="relative mt-2.5 leading-snug">
                    {campo(
                      `secciones.${i}.descripcion.${rolEfectivo}`,
                      s.descripcion[rolEfectivo],
                    )}
                  </p>

                  <p className="border-tinta/20 relative mt-auto flex items-center gap-2 border-t pt-5 text-sm font-semibold">
                    {campo(`secciones.${i}.verbo`, s.verbo)}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </p>
                </Envoltura>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ Al fondo: lo último y la puerta, uno al lado del otro ═════════ */}
      <section className="contenedor pb-4">
        {/* Cuál va primero lo decide la portada, no el código: desde el panel
            se pueden intercambiar sin tocar este archivo. */}
        <div className="grid gap-5 lg:grid-cols-2">
          {(portada.ordenAbajo === 'puerta-noticias'
            ? (['puerta', 'noticias'] as const)
            : (['noticias', 'puerta'] as const)
          ).map((cual) => (
            <div key={cual} className="relative h-full">
              {ganchos?.controlesAbajo?.(cual)}
              {cual === 'noticias' ? (
                <BloqueNoticias
                  destacada={vistas.destacada}
                  portada={portada}
                  campo={campo}
                  edicion={edicion}
                />
              ) : (
                <BloquePuerta
                  contacto={vistas.contacto}
                  portada={portada}
                  campo={campo}
                  edicion={edicion}
                />
              )}
            </div>
          ))}
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

type RenderCampo = (clave: string, valor: string) => React.ReactNode;

/**
 * Enlace de verdad en el sitio, <div> en el editor.
 *
 * Es lo que permite que el panel monte ESTE componente y no una copia: la
 * única diferencia entre lo que se edita y lo que se publica es que en el
 * editor los enlaces no llevan a ningún sitio.
 */
function Envoltura({
  edicion,
  href,
  className,
  style,
  children,
}: {
  edicion: boolean;
  href: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (edicion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

/**
 * Lo último publicado.
 *
 * La pieza del megáfono viene como TARJETA, no como recorte: es un rectángulo
 * azul opaco con el megáfono abajo a la derecha y el resto liso para poner
 * texto encima. Así que se usa tal cual, de fondo con `cover` anclado abajo a
 * la derecha — el megáfono sobrevive a cualquier recorte y el azul liso
 * rellena el resto. El color de respaldo es el mismo azul del archivo
 * (#113d82) para que no se vea el canto si la imagen tarda. Blanco sobre ese
 * azul mide 10.14:1.
 */
function BloqueNoticias({
  destacada,
  portada,
  campo,
  edicion,
}: {
  destacada: Vistas['destacada'];
  portada: Portada;
  campo: RenderCampo;
  edicion: boolean;
}) {
  if (!destacada) {
    return (
      <div className="bg-azul-100 flex h-full flex-col items-center justify-center rounded-3xl p-10 text-center">
        <Megafono className="h-24 w-auto opacity-60" />
        <p className="text-gris mt-4 max-w-xs">
          {campo('sinNoticias', portada.sinNoticias)}
        </p>
      </div>
    );
  }

  return (
    <Envoltura
      edicion={edicion}
      href={`/noticias/${destacada.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#113d82] p-8 text-white"
      style={{
        backgroundImage: "url('/megafono.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'right bottom',
      }}
    >
      <div className="relative max-w-sm">
        <p className="text-ambar text-xs font-semibold tracking-[0.16em] uppercase">
          {campo('recienteEtiqueta', portada.recienteEtiqueta)}
        </p>
        <h2 className="font-titulo mt-4 text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
          {destacada.titulo}
        </h2>
        {destacada.bajada ? (
          <p className="mt-3 leading-relaxed text-white/85">
            {destacada.bajada}
          </p>
        ) : null}
      </div>
      <div className="relative mt-8 flex flex-wrap items-center gap-4">
        {destacada.etiqueta ? (
          <span className="bg-ambar text-tinta rounded-full px-4 py-1.5 text-sm font-semibold">
            {destacada.etiqueta}
          </span>
        ) : null}
        <span className="flex items-center gap-2 text-sm text-white/80">
          <IconoCalendario className="h-4 w-4" />
          {destacada.fecha}
        </span>
      </div>
    </Envoltura>
  );
}

/**
 * La puerta abierta. Antes vivía en el pie de TODAS las páginas; aquí cierra
 * la portada con lo único que de verdad hace falta saber para pasar por la
 * oficina: dónde y cuándo.
 */
function BloquePuerta({
  contacto,
  portada,
  campo,
  edicion,
}: {
  contacto: Vistas['contacto'];
  portada: Portada;
  campo: RenderCampo;
  edicion: boolean;
}) {
  return (
    <div className="bg-crema border-tinta/10 relative h-full overflow-hidden rounded-3xl border p-8">
      <Image
        src="/puerta.webp"
        alt=""
        width={416}
        height={386}
        className="pointer-events-none absolute right-2 bottom-2 hidden h-56 w-auto sm:block lg:h-64"
      />
      <div className="relative max-w-sm">
        <h2 className="font-titulo text-tinta text-3xl leading-[1.06] font-bold tracking-[-0.015em]">
          {campo('puertaAntes', portada.puertaAntes)}{' '}
          <em className="text-azul-700 italic">
            {campo('puertaAcento', portada.puertaAcento)}
          </em>
          {campo('puertaDespues', portada.puertaDespues)}
        </h2>
        <p className="text-gris mt-3 leading-relaxed">
          {campo('puertaTexto', portada.puertaTexto)}
        </p>

        {contacto?.oficina || contacto?.horario ? (
          <dl className="border-tinta/15 mt-6 space-y-4 border-t pt-5">
            {/* Rejilla, no divs anidados. Un <dl> admite dt/dd dentro de UN
                <div>, pero no dos niveles abajo: axe lo marca como grave. El
                icono ocupa las dos filas de la columna izquierda y queda como
                hermano del dt y el dd. */}
            {contacto.oficina ? (
              <div className="grid grid-cols-[auto_1fr] items-start gap-x-3">
                <IconoLugar className="text-azul-700 row-span-2 mt-0.5 h-5 w-5" />
                <dt className="text-azul-700 text-xs font-semibold tracking-[0.16em] uppercase">
                  Dónde
                </dt>
                <dd className="text-tinta mt-0.5">{contacto.oficina}</dd>
              </div>
            ) : null}
            {contacto.horario ? (
              <div className="grid grid-cols-[auto_1fr] items-start gap-x-3">
                <IconoReloj className="text-azul-700 row-span-2 mt-0.5 h-5 w-5" />
                <dt className="text-azul-700 text-xs font-semibold tracking-[0.16em] uppercase">
                  Cuándo
                </dt>
                <dd className="text-tinta mt-0.5">{contacto.horario}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <Envoltura
          edicion={edicion}
          href="/calendario"
          className="bg-ambar text-tinta hover:bg-amarillo mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition-colors"
        >
          {campo('puertaBoton', portada.puertaBoton)}
          <span aria-hidden>→</span>
        </Envoltura>
      </div>
    </div>
  );
}
