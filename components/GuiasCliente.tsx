'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Categoria } from '@/lib/tipos';
import { coincide, soloTexto } from '@/lib/busqueda';
import { CuerpoPregunta, type PreguntaConGente } from './CuerpoPregunta';
import { BANDA_ACENTO, TINTE_ACENTO } from './ui/Tarjeta';

export type SeccionGuia = {
  categoria: Categoria;
  preguntas: PreguntaConGente[];
};

export function GuiasCliente({ secciones }: { secciones: SeccionGuia[] }) {
  const [consulta, setConsulta] = useState('');
  const buscando = consulta.trim().length > 0;

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
        <label htmlFor="buscar" className="text-gris block text-sm font-medium">
          Buscar una pregunta
        </label>
        <input
          id="buscar"
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Escribe una palabra…"
          className="border-borde focus:border-azul-700 mt-1.5 w-full max-w-md rounded-xl border-2 bg-white px-4 py-3"
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
        <div className="border-borde text-gris mt-6 rounded-2xl border border-dashed p-10 text-center">
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
          <section key={s.categoria.id}>
            {/* Pestaña de carpeta: la metáfora del archivador (doc 03 §1) */}
            <div className="flex items-end">
              <h2
                className={`text-tinta rounded-t-xl px-5 py-2.5 font-bold ${BANDA_ACENTO[s.categoria.acento]}`}
              >
                {s.categoria.titulo}
              </h2>
            </div>
            <div
              className={`rounded-tr-2xl rounded-b-2xl p-4 sm:p-5 ${TINTE_ACENTO[s.categoria.acento]}`}
            >
              <p className="text-gris mb-4 text-sm">
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
          </section>
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
      className="border-borde group overflow-hidden rounded-xl border bg-white"
    >
      <summary className="hover:bg-azul-100/50 flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium">
        <span className="text-tinta">{pregunta.pregunta}</span>
        <span
          aria-hidden
          className="text-azul-700 shrink-0 text-xl transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-borde border-t px-5 py-5">
        <CuerpoPregunta datos={datos} />
        <p className="not-print mt-5">
          <Link
            href={`/guias/${pregunta.slug}`}
            className="text-azul-700 rounded text-sm underline"
          >
            Abrir esta guía en su propia página
          </Link>
        </p>
      </div>
    </details>
  );
}
