'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { EditorTexto } from './EditorTexto';
import { Semaforo } from './Semaforo';
import { VistaPrevia } from './VistaPrevia';
import { SelectorPlantilla } from './SelectorPlantilla';
import { SubidorImagen } from './SubidorImagen';
import { PlantillaAnuncio } from '@/components/plantillas/Plantillas';
import { puedePublicar, revisar } from '@/lib/semaforo';
import { guardarNoticia } from '@/app/edit/panel/noticias/acciones';
import type { Anuncio, Perfil, PlantillaId } from '@/lib/tipos';

function aDireccion(t: string): string {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

const soloFecha = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
const aIso = (f: string) =>
  f ? new Date(`${f}T12:00:00`).toISOString() : null;

/** Por defecto, los anuncios se retiran solos a los 60 días (doc 02).
 *  Es el campo que impide que el sitio parezca abandonado en marzo. */
function expiraPorDefecto(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
}

export function EditorNoticia({
  inicial,
  perfiles,
  esNuevo,
}: {
  inicial: Anuncio;
  perfiles: Perfil[];
  esNuevo: boolean;
}) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [plantilla, setPlantilla] = useState<PlantillaId>(inicial.plantilla);
  const [titulo, setTitulo] = useState(inicial.titulo);
  const [bajada, setBajada] = useState(inicial.bajada ?? '');
  const [cuerpo, setCuerpo] = useState(inicial.cuerpo);
  const [direccion, setDireccion] = useState(inicial.slug);
  const [tocoDireccion, setTocoDireccion] = useState(!esNuevo);
  const [autor, setAutor] = useState(inicial.autorPerfilId ?? '');
  const [destacado, setDestacado] = useState(inicial.destacado);
  const [etiquetas, setEtiquetas] = useState(inicial.etiquetas.join(', '));
  const [esEvento, setEsEvento] = useState(Boolean(inicial.fechaEvento));
  const [fechaEvento, setFechaEvento] = useState(
    soloFecha(inicial.fechaEvento),
  );
  const [horaTexto, setHoraTexto] = useState(inicial.horaTexto ?? '');
  const [lugar, setLugar] = useState(inicial.lugar ?? '');
  const [expira, setExpira] = useState(
    esNuevo ? expiraPorDefecto() : soloFecha(inicial.expiraEn),
  );
  const [imagenUrl, setImagenUrl] = useState(inicial.imagen?.url ?? null);
  const [imagenAlt, setImagenAlt] = useState(inicial.imagen?.alt ?? '');

  const hallazgos = useMemo(
    () =>
      revisar({
        titulo,
        cuerpoHtml: cuerpo,
        tieneImagen: Boolean(imagenUrl),
        imagenAlt,
      }),
    [titulo, cuerpo, imagenUrl, imagenAlt],
  );
  const listo = puedePublicar(hallazgos);

  const borrador: Anuncio = {
    ...inicial,
    plantilla,
    titulo: titulo || 'Tu título aquí',
    bajada: bajada || null,
    cuerpo,
    fechaEvento: esEvento ? aIso(fechaEvento) : null,
    horaTexto: esEvento ? horaTexto || null : null,
    lugar: esEvento ? lugar || null : null,
    etiquetas: etiquetas
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
    imagen: imagenUrl
      ? {
          url: imagenUrl,
          alt: imagenAlt,
          ancho: 1600,
          alto: 900,
          focoX: 0.5,
          focoY: 0.5,
        }
      : null,
  };

  function guardar(publicar: boolean) {
    setError(null);
    empezar(async () => {
      const r = await guardarNoticia({
        id: inicial.id,
        plantilla,
        titulo,
        bajada: bajada || null,
        cuerpo,
        slug: direccion,
        etiquetas: borrador.etiquetas,
        fechaEvento: esEvento ? aIso(fechaEvento) : null,
        horaTexto: esEvento ? horaTexto || null : null,
        lugar: esEvento ? lugar || null : null,
        autorPerfilId: autor || null,
        destacado,
        publicarEn: inicial.publicarEn,
        expiraEn: aIso(expira),
        imagenUrl,
        imagenAlt,
        publicar,
      });
      if (r.ok) {
        setOk(
          publicar ? 'Publicado. Ya se ve en el sitio.' : 'Borrador guardado.',
        );
        router.refresh();
      } else setError(r.error);
    });
  }

  const campo =
    'border-borde focus:border-azul-700 mt-2 w-full rounded-xl border-2 px-4 py-3';

  return (
    <div className="grid gap-8 lg:grid-cols-[45fr_55fr]">
      <div className="space-y-6">
        <div>
          <label htmlFor="titulo" className="text-tinta block font-semibold">
            Título
          </label>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              if (!tocoDireccion) setDireccion(aDireccion(e.target.value));
            }}
            className={`${campo} text-[17px]`}
          />
        </div>

        <div>
          <label htmlFor="bajada" className="text-tinta block font-semibold">
            Resumen en una línea
          </label>
          <input
            id="bajada"
            value={bajada}
            onChange={(e) => setBajada(e.target.value)}
            className={campo}
          />
        </div>

        <div>
          <span className="text-tinta block font-semibold">El mensaje</span>
          <div className="mt-2">
            <EditorTexto
              valor={inicial.cuerpo}
              alCambiar={setCuerpo}
              etiqueta="El mensaje"
            />
          </div>
        </div>

        <SelectorPlantilla
          valor={plantilla}
          titulo={titulo}
          alCambiar={setPlantilla}
        />

        <SubidorImagen
          url={imagenUrl}
          alt={imagenAlt}
          alCambiarUrl={setImagenUrl}
          alCambiarAlt={setImagenAlt}
        />

        <div>
          <label htmlFor="autor" className="text-tinta block font-semibold">
            ¿Quién lo publica?
          </label>
          <select
            id="autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className={`${campo} bg-white`}
          >
            <option value="">Sin firmar</option>
            {perfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="etiquetas" className="text-tinta block font-semibold">
            Etiquetas
          </label>
          <input
            id="etiquetas"
            value={etiquetas}
            onChange={(e) => setEtiquetas(e.target.value)}
            placeholder="Becas, Eventos"
            className={campo}
          />
        </div>

        <div className="border-borde rounded-xl border bg-white p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={esEvento}
              onChange={(e) => setEsEvento(e.target.checked)}
              className="h-6 w-6"
            />
            <span className="text-tinta font-semibold">Es un evento</span>
          </label>

          {esEvento ? (
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="fecha"
                  className="text-tinta block text-sm font-medium"
                >
                  ¿Qué día?
                </label>
                <input
                  id="fecha"
                  type="date"
                  value={fechaEvento}
                  onChange={(e) => setFechaEvento(e.target.value)}
                  className={campo}
                />
              </div>
              <div>
                <label
                  htmlFor="hora"
                  className="text-tinta block text-sm font-medium"
                >
                  ¿A qué hora?
                </label>
                {/* Texto libre, no selector de hora: los selectores en
                    teléfono son horribles y la respuesta real muchas veces
                    es "después del almuerzo". */}
                <input
                  id="hora"
                  value={horaTexto}
                  onChange={(e) => setHoraTexto(e.target.value)}
                  placeholder="3:00 pm, o «después del almuerzo»"
                  className={campo}
                />
              </div>
              <div>
                <label
                  htmlFor="lugar"
                  className="text-tinta block text-sm font-medium"
                >
                  ¿Dónde?
                </label>
                <input
                  id="lugar"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  className={campo}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="expira" className="text-tinta block font-semibold">
            Quitar de la página el:
          </label>
          <p className="text-gris mt-1 text-sm">
            Se retira solo ese día. Sigue en el archivo para quien tenga el
            enlace. Déjalo vacío si no debe caducar nunca.
          </p>
          <input
            id="expira"
            type="date"
            value={expira}
            onChange={(e) => setExpira(e.target.value)}
            className={campo}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={destacado}
            onChange={(e) => setDestacado(e.target.checked)}
            className="h-6 w-6"
          />
          <span className="text-tinta font-semibold">
            Ponerlo primero en Noticias
          </span>
        </label>

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
        </details>

        <Semaforo hallazgos={hallazgos} />
      </div>

      <VistaPrevia>
        <div className="p-4">
          <PlantillaAnuncio
            anuncio={borrador}
            autor={perfiles.find((p) => p.id === autor) ?? null}
            fecha={new Intl.DateTimeFormat('es-PR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'America/Puerto_Rico',
            }).format(new Date(inicial.publicarEn))}
          />
        </div>
      </VistaPrevia>

      <div className="border-borde bg-papel sticky bottom-0 z-10 -mx-5 mt-2 flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4 lg:col-span-2">
        <p role="status" className="text-gris text-sm">
          {error ? (
            <span className="text-rosa-700 font-medium">{error}</span>
          ) : (
            (ok ?? 'Nada se ve en el sitio hasta que pulses Publicar.')
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
            className="bg-azul-700 hover:bg-azul-900 rounded-xl px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {pendiente ? 'Guardando…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
