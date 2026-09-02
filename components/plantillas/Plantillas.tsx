import Link from 'next/link';
import type { Anuncio, Perfil, PlantillaId } from '@/lib/tipos';
import { TextoRico } from '../TextoRico';
import { FotoPerfil } from '../FotoPerfil';

/**
 * Un esquema, ocho pieles (doc 02).
 *
 * Las ocho plantillas reciben EXACTAMENTE los mismos datos. Quien escribe
 * llena siempre el mismo formulario corto; la variedad la pone el diseño, no
 * más trabajo. Eso es lo que hace que el panel pueda ser simple y el sitio
 * parecer rico a la vez.
 *
 * Regla que vale para las ocho: la decoración va DETRÁS del texto. El texto
 * es siempre texto real, seleccionable, con contraste suficiente. Ninguna
 * plantilla dibuja letras dentro de una imagen ni pone el cuerpo en una
 * tipografía manuscrita.
 */

export type PropsPlantilla = {
  anuncio: Anuncio;
  autor: Perfil | null;
  fecha: string;
};

// ── Piezas compartidas ─────────────────────────────────────────────────────

function Autor({ autor, fecha }: { autor: Perfil | null; fecha: string }) {
  return (
    <div className="text-gris flex flex-wrap items-center gap-3 text-sm">
      <span>{fecha}</span>
      {autor ? (
        <>
          <span aria-hidden>·</span>
          <Link
            href={`/consejered/${autor.slug}`}
            className="text-azul-700 flex items-center gap-2 rounded underline"
          >
            <FotoPerfil perfil={autor} tamano="mini" />
            {autor.nombre}
          </Link>
        </>
      ) : null}
    </div>
  );
}

function DatosEvento({ anuncio }: { anuncio: Anuncio }) {
  if (!anuncio.fechaEvento && !anuncio.lugar && !anuncio.horaTexto) return null;
  return (
    <dl className="border-borde text-tinta mt-6 grid gap-2 border-t pt-4 text-sm sm:grid-cols-3">
      {anuncio.horaTexto ? (
        <div>
          <dt className="text-gris">Hora</dt>
          <dd className="font-medium">{anuncio.horaTexto}</dd>
        </div>
      ) : null}
      {anuncio.lugar ? (
        <div>
          <dt className="text-gris">Lugar</dt>
          <dd className="font-medium">{anuncio.lugar}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function Etiquetas({ etiquetas }: { etiquetas: string[] }) {
  if (etiquetas.length === 0) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {etiquetas.map((e) => (
        <li
          key={e}
          className="bg-azul-100 text-tinta rounded-full px-3 py-1 text-xs font-medium"
        >
          {e}
        </li>
      ))}
    </ul>
  );
}

// ── 1. Periódico ───────────────────────────────────────────────────────────

function Periodico({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <article className="bg-papel-prensa text-tinta rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
      <header className="border-tinta border-b-2 pb-3 text-center">
        <p className="font-periodico text-3xl font-black tracking-tight sm:text-5xl">
          El Boletín Escolar
        </p>
        <p className="text-gris mt-2 text-xs tracking-[0.2em] uppercase">
          Escuela Superior [Nombre] · {fecha}
        </p>
      </header>

      <h1 className="font-periodico mt-7 text-center text-3xl leading-tight font-bold sm:text-4xl">
        {anuncio.titulo}
      </h1>
      {anuncio.bajada ? (
        <p className="text-gris mt-2 text-center text-lg italic">
          {anuncio.bajada}
        </p>
      ) : null}

      <div className="border-tinta/25 mt-6 border-t pt-6">
        {/* Dos columnas solo en pantalla ancha: en un teléfono, columnas de
            texto obligan a subir y bajar por cada una. */}
        <TextoRico
          html={anuncio.cuerpo}
          className="[&>p:first-child::first-letter]:font-periodico sm:columns-2 sm:gap-8 [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:mt-1 [&>p:first-child::first-letter]:mr-2 [&>p:first-child::first-letter]:text-6xl [&>p:first-child::first-letter]:leading-none [&>p:first-child::first-letter]:font-bold"
        />
      </div>

      <DatosEvento anuncio={anuncio} />
      <div className="border-tinta/25 mt-6 border-t pt-4">
        <Autor autor={autor} fecha={fecha} />
      </div>
    </article>
  );
}

// ── 2. Artículo (blog) ─────────────────────────────────────────────────────

function Blog({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <article className="border-borde rounded-2xl border bg-white px-6 py-8 sm:px-10">
      <h1 className="font-titulo text-azul-900 text-3xl font-bold sm:text-4xl">
        {anuncio.titulo}
      </h1>
      {anuncio.bajada ? (
        <p className="text-gris mt-3 text-lg">{anuncio.bajada}</p>
      ) : null}
      <div className="mt-5">
        <Autor autor={autor} fecha={fecha} />
      </div>
      <TextoRico
        html={anuncio.cuerpo}
        className="text-tinta mt-7 text-[1.05rem] leading-relaxed"
      />
      <DatosEvento anuncio={anuncio} />
      <Etiquetas etiquetas={anuncio.etiquetas} />
    </article>
  );
}

// ── 3. Afiche ──────────────────────────────────────────────────────────────

function Afiche({ anuncio, autor, fecha }: PropsPlantilla) {
  const dia = anuncio.fechaEvento
    ? new Date(anuncio.fechaEvento).getUTCDate()
    : null;

  return (
    <article className="bg-naranja text-tinta overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-start justify-between gap-6 px-6 py-8 sm:px-10">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold tracking-[0.2em] uppercase">
            No te lo pierdas
          </p>
          <h1 className="font-titulo mt-3 text-4xl leading-[1.05] font-black sm:text-6xl">
            {anuncio.titulo}
          </h1>
          {anuncio.bajada ? (
            <p className="mt-4 text-xl font-medium">{anuncio.bajada}</p>
          ) : null}
        </div>

        {dia !== null ? (
          <div className="bg-rosa-700 grid h-28 w-28 shrink-0 place-items-center rounded-full text-center text-white">
            <span>
              <span className="block text-4xl font-black">{dia}</span>
              <span className="block text-xs tracking-widest uppercase">
                {new Intl.DateTimeFormat('es-PR', {
                  month: 'short',
                  timeZone: 'UTC',
                }).format(new Date(anuncio.fechaEvento!))}
              </span>
            </span>
          </div>
        ) : null}
      </div>

      <div className="bg-white px-6 py-7 sm:px-10">
        <TextoRico html={anuncio.cuerpo} className="text-tinta" />
        <DatosEvento anuncio={anuncio} />
        <div className="mt-5">
          <Autor autor={autor} fecha={fecha} />
        </div>
      </div>
    </article>
  );
}

// ── 4. Notita ──────────────────────────────────────────────────────────────

function Notita({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <div className="relative px-2 py-6">
      {/* Cinta adhesiva en dos esquinas */}
      <span
        aria-hidden
        className="bg-amarillo/70 absolute top-2 left-8 h-7 w-20 -rotate-6 shadow-sm"
      />
      <span
        aria-hidden
        className="bg-amarillo/70 absolute top-2 right-8 h-7 w-20 rotate-6 shadow-sm"
      />
      <article
        className="bg-libreta text-tinta -rotate-[0.8deg] rounded-lg px-6 py-9 shadow-lg sm:px-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 2.05rem, rgba(47,94,168,.13) 2.05rem 2.1rem)',
        }}
      >
        {/* Solo el titular va en manuscrita. El cuerpo se queda en la
            tipografía de siempre: una nota escrita a mano es simpática hasta
            que hay que leer tres párrafos. */}
        <h1 className="font-manuscrita text-azul-900 text-4xl leading-tight font-bold sm:text-5xl">
          {anuncio.titulo}
        </h1>
        {anuncio.bajada ? (
          <p className="font-manuscrita text-gris mt-1 text-2xl">
            {anuncio.bajada}
          </p>
        ) : null}
        <TextoRico html={anuncio.cuerpo} className="mt-6 leading-[2.1rem]" />
        <DatosEvento anuncio={anuncio} />
        <div className="mt-6">
          <Autor autor={autor} fecha={fecha} />
        </div>
      </article>
    </div>
  );
}

// ── 5. Tablón (corcho) ─────────────────────────────────────────────────────

function Corcho({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <div
      className="bg-corcho rounded-2xl p-6 sm:p-10"
      style={{
        backgroundImage:
          'radial-gradient(rgba(0,0,0,.14) 1px, transparent 1.4px), radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.4px)',
        backgroundSize: '9px 9px, 13px 13px',
        backgroundPosition: '0 0, 4px 6px',
      }}
    >
      <article className="text-tinta relative rotate-[0.6deg] rounded-sm bg-white px-6 py-9 shadow-xl sm:px-10">
        {/* La chincheta */}
        <span
          aria-hidden
          className="bg-rosa-700 absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full shadow-md ring-4 ring-white/50"
        />
        <h1 className="font-titulo text-azul-900 text-3xl font-bold">
          {anuncio.titulo}
        </h1>
        {anuncio.bajada ? (
          <p className="text-gris mt-2">{anuncio.bajada}</p>
        ) : null}
        <TextoRico html={anuncio.cuerpo} className="mt-5" />
        <DatosEvento anuncio={anuncio} />
        <div className="mt-5">
          <Autor autor={autor} fecha={fecha} />
        </div>
      </article>
    </div>
  );
}

// ── 6. Comunicado oficial ──────────────────────────────────────────────────

function Comunicado({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <article className="border-azul-900/25 text-tinta rounded-sm border-2 bg-white px-6 py-8 sm:px-12 sm:py-10">
      <header className="flex items-start gap-5">
        <span
          aria-hidden
          className="border-azul-900 text-azul-900 grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 text-[0.6rem] leading-tight font-bold tracking-widest"
        >
          SELLO
        </span>
        <div className="min-w-0">
          <p className="text-azul-900 text-sm font-bold tracking-[0.18em] uppercase">
            Comunicado oficial
          </p>
          <p className="text-gris text-sm">Escuela Superior [Nombre]</p>
        </div>
      </header>

      <dl className="border-azul-900/20 mt-7 space-y-1.5 border-y py-4 text-sm">
        <div className="flex gap-3">
          <dt className="text-gris w-20 shrink-0 font-semibold">PARA:</dt>
          <dd>Comunidad escolar</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-gris w-20 shrink-0 font-semibold">DE:</dt>
          <dd>{autor ? autor.nombre : 'Oficina de Consejería'}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-gris w-20 shrink-0 font-semibold">FECHA:</dt>
          <dd>{fecha}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-gris w-20 shrink-0 font-semibold">ASUNTO:</dt>
          <dd className="font-semibold">{anuncio.titulo}</dd>
        </div>
      </dl>

      <TextoRico html={anuncio.cuerpo} className="mt-6 leading-relaxed" />
      <DatosEvento anuncio={anuncio} />
    </article>
  );
}

// ── 7. Pizarra ─────────────────────────────────────────────────────────────

function Pizarra({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <article className="bg-pizarra text-tiza relative overflow-hidden rounded-2xl border-8 border-[#8a6a44] px-6 py-9 sm:px-10">
      {/* Manchas de borrador. Muy tenues a propósito: si oscurecieran el
          fondo de verdad, el texto encima perdería contraste. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 40% 18% at 25% 30%, #fff, transparent), radial-gradient(ellipse 35% 14% at 70% 65%, #fff, transparent)',
        }}
      />
      <div className="relative">
        <h1 className="font-tiza text-4xl leading-tight font-bold sm:text-5xl">
          {anuncio.titulo}
        </h1>
        {anuncio.bajada ? (
          <p className="font-tiza mt-2 text-xl opacity-90">{anuncio.bajada}</p>
        ) : null}
        {/* Cuerpo en la tipografía normal: la tiza es para el titular. */}
        <TextoRico html={anuncio.cuerpo} className="mt-6 leading-relaxed" />
        <div className="mt-7 flex flex-wrap gap-3 text-sm opacity-80">
          <span>{fecha}</span>
          {autor ? (
            <>
              <span aria-hidden>·</span>
              <Link
                href={`/consejered/${autor.slug}`}
                className="rounded underline"
              >
                {autor.nombre}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// ── 8. Urgente ─────────────────────────────────────────────────────────────

function Urgente({ anuncio, autor, fecha }: PropsPlantilla) {
  return (
    <article className="border-rosa-700 overflow-hidden rounded-2xl border-2 bg-white">
      <p className="bg-rosa-700 px-6 py-3 text-sm font-bold tracking-[0.2em] text-white uppercase">
        Aviso importante
      </p>
      <div className="text-tinta px-6 py-7 sm:px-10">
        <h1 className="font-titulo text-2xl font-bold sm:text-3xl">
          {anuncio.titulo}
        </h1>
        {anuncio.bajada ? (
          <p className="mt-2 font-medium">{anuncio.bajada}</p>
        ) : null}
        <TextoRico html={anuncio.cuerpo} className="mt-5" />
        <DatosEvento anuncio={anuncio} />
        <div className="mt-5">
          <Autor autor={autor} fecha={fecha} />
        </div>
      </div>
    </article>
  );
}

// ── Selector ───────────────────────────────────────────────────────────────

const MAPA: Record<PlantillaId, (p: PropsPlantilla) => React.ReactElement> = {
  periodico: Periodico,
  blog: Blog,
  afiche: Afiche,
  notita: Notita,
  corcho: Corcho,
  comunicado: Comunicado,
  pizarra: Pizarra,
  urgente: Urgente,
};

export function PlantillaAnuncio(props: PropsPlantilla) {
  const Elegida = MAPA[props.anuncio.plantilla] ?? Blog;
  return <Elegida {...props} />;
}
