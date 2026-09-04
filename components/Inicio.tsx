'use client';

import {
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
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
  FlechaMano,
  TrazoMarcador,
} from './Ilustraciones';
import { useRol } from './ProveedorRol';
import { type ClaveSeccion, type Rol } from '@/lib/rol';
import { coincide } from '@/lib/busqueda';
import { useIman, useInclinacion } from '@/hooks/use-inclinacion';
import {
  prefiereMenosMovimiento,
  prefiereMenosMovimientoServidor,
  suscribirMovimiento,
} from '@/lib/movimiento';
import { BANDA_ACENTO, type Acento } from './ui/Tarjeta';
import type { Portada, TarjetaPortada } from '@/lib/tipos';

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

/** Inclinaciones fijas, no aleatorias. `Math.random()` en el cuerpo de un
 *  componente es impuro: las reglas del compilador de React 19 lo rechazan, y
 *  además daría un ángulo distinto en el servidor y en el cliente, que es un
 *  fallo de hidratación. Una tabla fija se ve igual de casual y no miente. */
const INCLINACION = ['-rotate-[1.1deg]', 'rotate-[0.7deg]', '-rotate-[0.5deg]'];

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
          {/* La cejilla va en una chapa de papel con borde de tinta, no suelta
              sobre el fondo. Dos motivos: se lee como una etiqueta pegada —el
              idioma de toda la portada— y el texto pequeño pasa a medirse
              contra `crema` en vez de contra la malla, que es donde el gris
              tenía menos margen. */}
          <p className="border-tinta/50 bg-crema text-gris inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
            <SelloMini className="text-coral-700 h-3.5 w-3.5" />
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

          {/* Más grande y más apretado. El titular es el objeto de la página,
              no su etiqueta. */}
          <h1 className="font-titulo text-tinta mt-6 text-[3.6rem] leading-[0.88] font-bold tracking-[-0.045em] sm:text-[5rem] lg:text-[6.25rem]">
            {campo('tituloAntes', portada.tituloAntes)}{' '}
            {/* Trazo de marcador DETRÁS de la palabra, en vez del subrayado
                fino de antes. No es solo un cambio de gusto: con la palabra en
                tinta sobre ámbar el contraste es 10.15:1, contra los 4.59 que
                daba el azul sobre la malla. La decoración es aquí lo que
                mejora la lectura.
                El trazo se ancla a la palabra, así que la sigue aunque cambie
                de largo o salte de línea. */}
            <span className="relative inline-block">
              <TrazoMarcador className="pintar-trazo text-ambar pointer-events-none absolute top-[16%] -left-[4%] h-[78%] w-[108%]" />
              <em className="text-tinta relative italic">
                {campo('tituloAcento', portada.tituloAcento)}
              </em>
            </span>
            {campo('tituloDespues', portada.tituloDespues)}
          </h1>

          <p className="text-tinta/85 mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-balance">
            {campo('lede', portada.lede)}
          </p>
        </div>

        {/* La nota al margen y su flecha. Escrita a mano, como la que un
            consejero garabatearía al lado de una lista. La flecha lleva
            `aria-hidden`: la nota tiene que entenderse sin verla. */}
        <div className="relative mx-auto mt-10 hidden w-fit md:block">
          <p className="font-titulo text-tinta -rotate-[2.5deg] text-2xl italic">
            {campo('nota', portada.nota)}
          </p>
          <FlechaMano className="text-coral-700 pointer-events-none absolute -right-28 -bottom-4 h-16 w-24" />
        </div>

        {/* La perspectiva vive en el contenedor, no en cada tarjeta: si cada
            una tuviera la suya, las tres se verían desde su propio punto de
            fuga y el conjunto dejaría de leerse como un plano.
            El manejador de la luz también es UNO para las tres, no uno por
            tarjeta: en `pointermove` la diferencia se nota. */}
        <ol
          className="mt-12 grid gap-6 [perspective:900px] md:grid-cols-3"
          onPointerMove={(e) => {
            const c = (e.target as HTMLElement).closest<HTMLElement>('.foco');
            if (!c) return;
            const r = c.getBoundingClientRect();
            c.style.setProperty('--mx', `${e.clientX - r.left}px`);
            c.style.setProperty('--my', `${e.clientY - r.top}px`);
          }}
        >
          {portada.secciones.map((s, i) => (
            <TarjetaSeccion
              key={s.clave}
              s={s}
              i={i}
              rol={rolEfectivo}
              campo={campo}
              edicion={edicion}
              controles={ganchos?.controlesTarjeta?.(i)}
            />
          ))}
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
            <div key={cual} className="revelar relative h-full">
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
  // El único botón imantado de la portada: el efecto deja de decir nada en
  // cuanto hay cinco. Aquí es donde se espera que alguien se comprometa.
  const iman = useIman();
  const pista = usePistaRotativa(PISTAS, consulta.length === 0);
  const buscando = consulta.trim().length > 0;

  const resultados = useMemo(
    () =>
      buscando
        ? preguntas.filter((p) => coincide(consulta, p.pregunta)).slice(0, 5)
        : [],
    [preguntas, consulta, buscando],
  );

  return (
    <section className="revelar contenedor mt-16 pb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push('/guias');
        }}
        className="bg-ambar border-tinta relative flex flex-wrap items-center gap-5 overflow-hidden rounded-[3.5rem_1.25rem_1.25rem_1.25rem] border-2 px-6 py-7 sm:px-9"
      >
        <span
          aria-hidden
          className="border-tinta bg-crema text-tinta flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2"
        >
          <IconoLupa className="h-6 w-6" />
        </span>

        <div className="min-w-56 flex-1">
          <label
            htmlFor={id}
            className="text-tinta/70 text-xs font-semibold tracking-[0.18em] uppercase"
          >
            ¿Ya sabes qué buscas?
          </label>
          <input
            id={id}
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder={pista}
            autoComplete="off"
            aria-describedby={`${id}-estado`}
            className="text-tinta placeholder:text-tinta/70 border-tinta/55 focus:border-tinta mt-1 min-h-11 w-full border-b-2 bg-transparent text-lg transition-colors"
          />
        </div>

        <button
          type="submit"
          {...iman}
          className="border-tinta bg-crema text-tinta shrink-0 rounded-full border-2 px-7 py-3 font-semibold transition-colors hover:bg-white"
        >
          Buscar
        </button>

        <Image
          src="/libros.webp"
          alt=""
          width={418}
          height={298}
          className="flotar pointer-events-none hidden h-24 w-auto shrink-0 lg:block"
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
      <div className="bg-azul-100 border-tinta flex h-full -rotate-[0.6deg] flex-col items-center justify-center rounded-[1.5rem] border-2 p-10 text-center">
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
      className="group border-tinta relative flex h-full -rotate-[0.6deg] flex-col overflow-hidden rounded-[1.5rem] border-2 bg-[#113d82] p-8 text-white transition-[rotate,translate] duration-200 hover:translate-y-[-6px] hover:rotate-0"
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
    <div className="bg-crema border-tinta relative h-full rotate-[0.5deg] overflow-hidden rounded-[1.5rem] border-2 p-8">
      <Image
        src="/puerta.webp"
        alt=""
        width={416}
        height={386}
        className="flotar pointer-events-none absolute right-2 bottom-2 hidden h-56 w-auto sm:block lg:h-64"
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
          className="border-tinta bg-crema text-tinta hover:bg-ambar mt-7 inline-flex items-center gap-2 rounded-full border-2 px-5 py-3 font-semibold transition-colors"
        >
          {campo('puertaBoton', portada.puertaBoton)}
          <span aria-hidden>→</span>
        </Envoltura>
      </div>
    </div>
  );
}

/**
 * Una de las tres tarjetas de sección.
 *
 * Existe como componente propio por una razón muy concreta: `usarInclinacion`
 * es un hook, y un hook no se puede llamar dentro de un `.map()`. Cada tarjeta
 * necesita su propio ref y sus propias variables `--rx`/`--ry`, así que cada
 * tarjeta tiene que ser un componente.
 *
 * El giro 3D va en un <div> que envuelve, no en el enlace: así se compone con
 * la inclinación de reposo y el salto de hover, que viven en el enlace como
 * propiedades individuales `rotate` y `translate`. Padre e hijo multiplican
 * sus transformaciones; en el mismo elemento se pisarían.
 */
function TarjetaSeccion({
  s,
  i,
  rol,
  campo,
  edicion,
  controles,
}: {
  s: TarjetaPortada;
  i: number;
  rol: Rol;
  campo: RenderCampo;
  edicion: boolean;
  controles?: React.ReactNode;
}) {
  const r = RUTA[s.clave];
  const inclinacion = useInclinacion<HTMLDivElement>(7);

  return (
    <li className="revelar relative">
      {controles}
      <div className="inclinable h-full" {...inclinacion}>
        {/* Borde de tinta y una inclinación mínima: las tarjetas se leen como
            cartulinas pegadas, no como bloques de color de una cuadrícula. Al
            pasar el ratón se enderezan, suben y se giran hacia el cursor.
            La inclinación de reposo es de un grado, no de los cinco a quince
            de una pegatina decorativa: aquí dentro hay texto que hay que
            poder leer. */}
        <Envoltura
          edicion={edicion}
          href={r.href}
          className={`group foco border-tinta text-tinta relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border-2 p-7 transition-[rotate,translate] duration-200 hover:translate-y-[-6px] hover:rotate-0 ${INCLINACION[i % INCLINACION.length]} ${BANDA_ACENTO[r.acento]}`}
        >
          <Sello
            petalos={12}
            giro={i * 15}
            vivo
            className="text-tinta/10 pointer-events-none absolute -right-14 -bottom-16 h-52 w-52"
          />

          {/* El número, como la pegatina numerada de una carpeta. */}
          <span
            aria-hidden
            className="border-tinta bg-crema font-titulo text-tinta relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold tabular-nums"
          >
            {i + 1}
          </span>

          <h2 className="font-titulo relative mt-6 text-[2rem] leading-[1.04] font-bold tracking-[-0.025em]">
            {campo(`secciones.${i}.titulo`, s.titulo)}
          </h2>
          <p className="relative mt-3 leading-snug">
            {campo(`secciones.${i}.descripcion.${rol}`, s.descripcion[rol])}
          </p>

          {/* La acción es una chapa con borde de tinta sobre papel, no un
              relleno de color: el color ya lo pone la tarjeta, y dos rellenos
              seguidos se anulan. */}
          <span className="border-tinta bg-crema text-tinta relative mt-7 inline-flex w-fit items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold">
            {campo(`secciones.${i}.verbo`, s.verbo)}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Envoltura>
      </div>
    </li>
  );
}

/**
 * Lo que el buscador se ofrece a buscar, uno a uno.
 *
 * No es decoración. Un campo vacío con la lupa al lado no le dice a nadie qué
 * puede preguntar; estas cinco palabras sí, y la tercera es la que importa:
 * ver «ansiedad» escrito por la propia oficina es permiso para escribirlo.
 */
const PISTAS = [
  'matrícula',
  'becas',
  'ansiedad',
  'cambio de curso',
  'universidad',
];

/**
 * Rota el texto de ejemplo del buscador.
 *
 * Se para en dos casos, y los dos importan:
 *
 *  · Con `prefers-reduced-motion`, donde en vez de rotar enseña la lista
 *    entera de una vez. Nadie pierde información: lo que era una secuencia
 *    pasa a ser una enumeración.
 *  · En cuanto alguien escribe, porque a partir de ahí el marcador de
 *    posición ni siquiera se ve y el temporizador sería trabajo tirado.
 *
 * 3.2 s por palabra. Más rápido y se vuelve un cartel parpadeante al lado de
 * un campo de texto, que es justo lo que las reglas de la casa prohíben.
 */
function usePistaRotativa(pistas: string[], activo: boolean): string {
  const menos = useSyncExternalStore(
    suscribirMovimiento,
    prefiereMenosMovimiento,
    prefiereMenosMovimientoServidor,
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!activo || menos) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % pistas.length),
      3200,
    );
    return () => window.clearInterval(t);
  }, [activo, menos, pistas.length]);

  if (menos || !activo) return `${pistas.join(', ')}…`;
  return `${pistas[i % pistas.length]}…`;
}
