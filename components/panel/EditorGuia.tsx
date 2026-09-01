'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { EditorTexto } from './EditorTexto';
import { Semaforo } from './Semaforo';
import { VistaPrevia } from './VistaPrevia';
import { CuerpoPregunta } from '@/components/CuerpoPregunta';
import { puedePublicar, revisar } from '@/lib/semaforo';
import { guardarGuia } from '@/app/edit/panel/guias/acciones';
import type { Categoria, Perfil, Pregunta } from '@/lib/tipos';

/** "¿Cómo pido una cita?" -> "como-pido-una-cita" */
function aDireccion(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export function EditorGuia({
  inicial,
  categorias,
  perfiles,
  esNueva,
}: {
  inicial: Pregunta;
  categorias: Categoria[];
  perfiles: Perfil[];
  esNueva: boolean;
}) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState<string | null>(null);

  const [pregunta, setPregunta] = useState(inicial.pregunta);
  const [respuesta, setRespuesta] = useState(inicial.respuesta);
  const [categoriaId, setCategoriaId] = useState(
    inicial.categoriaId || (categorias[0]?.id ?? ''),
  );
  const [responsables, setResponsables] = useState<string[]>(
    inicial.responsables,
  );
  // La dirección se calcula sola desde el título. Nunca se le enseña la
  // palabra "slug" a nadie (doc 04 §9).
  const [direccion, setDireccion] = useState(inicial.slug);
  const [tocoDireccion, setTocoDireccion] = useState(!esNueva);

  const hallazgos = useMemo(
    () => revisar({ titulo: pregunta, cuerpoHtml: respuesta }),
    [pregunta, respuesta],
  );
  const listo = puedePublicar(hallazgos);

  const borrador: Pregunta = {
    ...inicial,
    pregunta,
    respuesta,
    categoriaId,
    responsables,
    slug: direccion,
  };

  function alEscribirTitulo(v: string) {
    setPregunta(v);
    if (!tocoDireccion) setDireccion(aDireccion(v));
  }

  function guardar(publicar: boolean) {
    setError(null);
    empezar(async () => {
      const r = await guardarGuia({
        id: inicial.id,
        categoriaId,
        pregunta,
        respuesta,
        slug: direccion,
        responsables,
        publicar,
      });
      if (r.ok) {
        setGuardado(
          publicar ? 'Publicado. Ya se ve en el sitio.' : 'Borrador guardado.',
        );
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[45fr_55fr]">
      {/* ── Formulario ────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <label htmlFor="pregunta" className="text-tinta block font-semibold">
            La pregunta
          </label>
          <input
            id="pregunta"
            value={pregunta}
            onChange={(e) => alEscribirTitulo(e.target.value)}
            placeholder="¿Cómo pido una cita con la consejera?"
            className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 px-4 py-3.5 text-[17px]"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="text-tinta block font-semibold">
            ¿En qué sección va?
          </label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[17px]"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-tinta block font-semibold">La respuesta</span>
          <div className="mt-2">
            <EditorTexto
              valor={inicial.respuesta}
              alCambiar={setRespuesta}
              etiqueta="La respuesta"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-tinta font-semibold">Pregúntale a:</legend>
          <p className="text-gris mt-1 text-sm">
            Quién puede ayudar con este tema.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {perfiles.map((p) => {
              const puesto = responsables.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 text-sm ${
                    puesto
                      ? 'border-azul-700 bg-azul-700 text-white'
                      : 'border-borde text-tinta bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={puesto}
                    onChange={() =>
                      setResponsables((r) =>
                        puesto ? r.filter((x) => x !== p.id) : [...r, p.id],
                      )
                    }
                  />
                  {p.nombre}
                </label>
              );
            })}
          </div>
        </fieldset>

        <details className="border-borde rounded-xl border bg-white px-4 py-3">
          <summary className="text-gris cursor-pointer text-sm">
            Dirección de la página (avanzado)
          </summary>
          <input
            value={direccion}
            onChange={(e) => {
              setTocoDireccion(true);
              setDireccion(aDireccion(e.target.value));
            }}
            className="border-borde mt-3 w-full rounded-lg border px-3 py-2 font-mono text-sm"
          />
          <p className="text-gris mt-2 text-xs">
            /guias/{direccion || '…'} — se calcula sola desde la pregunta.
          </p>
        </details>

        <Semaforo hallazgos={hallazgos} />
      </div>

      {/* ── Vista previa ──────────────────────────────────────────────── */}
      <VistaPrevia>
        <article className="px-6 py-8">
          <h1 className="font-titulo text-azul-900 text-2xl font-bold">
            {pregunta || 'La pregunta aparecerá aquí'}
          </h1>
          <div className="mt-6">
            <CuerpoPregunta
              nivel="h2"
              mostrarUtilidad={false}
              datos={{
                pregunta: borrador,
                responsables: perfiles.filter((p) =>
                  responsables.includes(p.id),
                ),
              }}
            />
          </div>
        </article>
      </VistaPrevia>

      {/* ── Barra de guardado ─────────────────────────────────────────── */}
      <div className="border-borde bg-papel sticky bottom-0 z-10 -mx-5 mt-2 flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4 lg:col-span-2">
        <p role="status" className="text-gris text-sm">
          {error ? (
            <span className="text-rosa-700 font-medium">{error}</span>
          ) : (
            (guardado ?? 'Nada se ve en el sitio hasta que pulses Publicar.')
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => guardar(false)}
            disabled={pendiente}
            className="border-azul-700 text-azul-700 hover:bg-azul-100 rounded-xl border-2 px-5 py-2.5 font-semibold disabled:opacity-50"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => guardar(true)}
            disabled={pendiente || !listo}
            title={listo ? undefined : 'Arregla lo que está en rojo'}
            className="bg-azul-700 hover:bg-azul-900 rounded-xl px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {pendiente ? 'Guardando…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
