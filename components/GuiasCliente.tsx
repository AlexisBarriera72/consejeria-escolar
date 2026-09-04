'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Categoria } from '@/lib/tipos';
import { coincide, soloTexto } from '@/lib/busqueda';
import { CuerpoPregunta, type PreguntaConGente } from './CuerpoPregunta';
import { BANDA_ACENTO, TINTE_ACENTO } from './ui/Tarjeta';
import { Sello } from './Sello';

export type SeccionGuia = {
  categoria: Categoria;
  preguntas: PreguntaConGente[];
};

export function GuiasCliente({ secciones }: { secciones: SeccionGuia[] }) {
  const [consulta, setConsulta] = useState('');
  // La primera categoría abierta y las demás cerradas: quien llega ve la
  // forma completa del archivador sin tener que bajar por doce preguntas.
  const [abiertas, setAbiertas] = useState<string[]>(
    secciones[0] ? [secciones[0].categoria.id] : [],
  );
  const buscando = consulta.trim().length > 0;

  /**
   * El estado se sincroniza DESDE el <details>, nunca al revés.
   *
   * Antes esto colgaba de un `onClick` en el <summary> y había que pulsar dos
   * veces la primera vez. La causa es el orden de los eventos: al pulsar un
   * <summary>, el navegador dispara `click` y solo DESPUÉS ejecuta la acción
   * por defecto, que es abrir o cerrar el <details>. React trata el clic como
   * evento discreto y vacía el estado de forma síncrona, así que pasaba esto:
   *
   *   1. onClick cambia el estado y React escribe `open = true`.
   *   2. Corre la acción por defecto y el navegador lo alterna: `open = false`.
   *   3. Resultado neto: nada. Hace falta otro clic.
   *
   * Y a partir del segundo clic «funcionaba», pero solo porque el estado y el
   * DOM se habían quedado invertidos y la escritura de React pasaba a no hacer
   * nada. Con `onToggle` no hay carrera: el evento llega cuando el navegador
   * YA ha cambiado el elemento, y el estado se limita a copiar lo que pasó.
   */
  const sincronizar = (id: string, abierto: boolean) => {
    // Mientras se busca manda la consulta, no el estado guardado.
    if (buscando) return;
    setAbiertas((a) =>
      abierto ? (a.includes(id) ? a : [...a, id]) : a.filter((x) => x !== id),
    );
  };

  const filtradas = useMemo(() => {
    if (!buscando) return secciones;
    return secciones
      .map((s) => ({
        ...s,
        preguntas: s.preguntas.filter((p) =>
          coincide(
            consulta,
            p.pregunta.pregunta,
            soloTexto(p.pregunta.respuesta),
          ),
        ),
      }))
      .filter((s) => s.preguntas.length > 0);
  }, [secciones, consulta, buscando]);

  const total = filtradas.reduce((n, s) => n + s.preguntas.length, 0);

  // Si alguien pulsa Ctrl+P con los acordeones cerrados, saldría una hoja con
  // doce títulos y ninguna respuesta. CSS no puede abrir un <details>, así
  // que se abren todos justo antes de imprimir.
  useEffect(() => {
    const abrirTodo = () => {
      document
        .querySelectorAll<HTMLDetailsElement>('details')
        .forEach((d) => (d.open = true));
    };
    window.addEventListener('beforeprint', abrirTodo);
    return () => window.removeEventListener('beforeprint', abrirTodo);
  }, []);

  return (
    <>
      <div className="not-print mt-8">
        <label
          htmlFor="buscar"
          className="text-tinta/80 block text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Buscar una pregunta
        </label>
        <input
          id="buscar"
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Escribe una palabra…"
          className="border-tinta bg-crema text-tinta placeholder:text-tinta/65 mt-1.5 w-full max-w-md rounded-full border-2 px-5 py-3 transition-colors focus:bg-white"
        />
        {/* role="status" hace que un lector de pantalla anuncie cuántos
            resultados hay sin sacar el foco del campo de búsqueda. */}
        <p role="status" className="text-gris mt-2 h-5 text-sm">
          {buscando
            ? total === 0
              ? 'No encontramos nada con esa palabra.'
              : `${total} ${total === 1 ? 'resultado' : 'resultados'}`
            : ''}
        </p>
      </div>

      {buscando && total === 0 ? (
        <div className="border-tinta/60 text-tinta/80 mt-6 rounded-[1.25rem] border-2 border-dashed p-10 text-center">
          <p>Prueba con otra palabra, o mira todas las guías.</p>
          <button
            type="button"
            onClick={() => setConsulta('')}
            className="text-azul-700 mt-3 rounded underline"
          >
            Ver todas
          </button>
        </div>
      ) : null}

      <div className="mt-6 space-y-10">
        {filtradas.map((s) => (
          <details
            key={s.categoria.id}
            open={buscando || abiertas.includes(s.categoria.id)}
            onToggle={(e) => sincronizar(s.categoria.id, e.currentTarget.open)}
            className="revelar group group/cat border-tinta overflow-hidden rounded-[1.25rem] border-2"
          >
            {/* La pestaña de carpeta ES el tirador. Un <details> nativo da
                gratis el teclado, la semántica de expandible y — lo que más
                importa aquí — funciona sin JavaScript. Por eso el estado se
                sincroniza con `onToggle` en el <details> y NO con un onClick
                en el <summary>: ver el comentario de `sincronizar`. */}
            <summary
              className={`text-tinta border-tinta relative flex cursor-pointer items-center justify-between gap-4 overflow-hidden border-b-2 px-5 py-4 ${BANDA_ACENTO[s.categoria.acento]}`}
            >
              {/* La flor, apagada, como la marca de agua de una carpeta. */}
              <Sello
                petalos={12}
                vivo
                className="text-tinta/10 pointer-events-none absolute -right-8 -bottom-10 h-28 w-28"
              />
              <span className="font-titulo relative text-2xl font-bold tracking-[-0.02em]">
                {s.categoria.titulo}
              </span>
              <span className="relative flex items-center gap-3 text-sm font-semibold">
                {s.preguntas.length}
                {/* El «+» como pegatina con borde, igual que el número de las
                    tarjetas de la portada. */}
                <span
                  aria-hidden
                  className="border-tinta bg-crema flex h-8 w-8 items-center justify-center rounded-full border-2 text-lg leading-none transition-transform group-open/cat:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <div className={`p-4 sm:p-5 ${TINTE_ACENTO[s.categoria.acento]}`}>
              <p className="text-tinta/80 mb-4 text-sm">
                {s.categoria.descripcion}
              </p>
              <ul className="space-y-2.5">
                {s.preguntas.map((p) => (
                  <li key={p.pregunta.id}>
                    <FilaPregunta datos={p} abierta={buscando} />
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function FilaPregunta({
  datos,
  abierta,
}: {
  datos: PreguntaConGente;
  abierta: boolean;
}) {
  const { pregunta } = datos;

  return (
    /*
      <details> nativo, no un div con onClick.
      El navegador ya trae la semántica de "expandible" para lectores de
      pantalla, el manejo de teclado (Enter y Espacio) y — lo que más
      importa — funciona aunque el JavaScript no cargue. En un teléfono con
      mala conexión, las guías se pueden abrir y leer igual.

      La `key` cambia al entrar o salir de una búsqueda para forzar el
      remontaje: así los resultados aparecen abiertos, y al limpiar la
      búsqueda todo vuelve a estar cerrado.
    */
    <details
      key={abierta ? 'abierta' : 'cerrada'}
      open={abierta}
      className="border-tinta/60 group bg-crema overflow-hidden rounded-xl border-2"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium transition-colors hover:bg-white">
        <span className="text-tinta">{pregunta.pregunta}</span>
        <span
          aria-hidden
          className="border-tinta/60 text-tinta flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-base leading-none transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-tinta/50 border-t-2 px-5 py-5">
        <CuerpoPregunta datos={datos} />
        <p className="not-print mt-5">
          <Link
            href={`/guias/${pregunta.slug}`}
            className="barrido text-azul-700 rounded text-sm"
          >
            Abrir esta guía en su propia página
          </Link>
        </p>
      </div>
    </details>
  );
}
