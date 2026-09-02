'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { EditorTexto } from './EditorTexto';
import { VistaPrevia } from './VistaPrevia';
import { FotoPerfil } from '@/components/FotoPerfil';
import { BANDA_ACENTO, TINTE_ACENTO } from '@/components/ui/Tarjeta';
import { guardarPerfil } from '@/app/edit/panel/perfiles/acciones';
import type { Acento, Credencial, Perfil } from '@/lib/tipos';

const ACENTOS: Acento[] = [
  'azul',
  'turquesa',
  'menta',
  'rosa',
  'coral',
  'naranja',
  'ambar',
  'salvia',
];

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

export function EditorPerfil({
  inicial,
  otros,
  esNuevo,
}: {
  inicial: Perfil;
  otros: Perfil[];
  esNuevo: boolean;
}) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [nombre, setNombre] = useState(inicial.nombre);
  const [puesto, setPuesto] = useState(inicial.puesto);
  const [escuela, setEscuela] = useState(inicial.escuela);
  const [direccion, setDireccion] = useState(inicial.slug);
  const [tocoDireccion, setTocoDireccion] = useState(!esNuevo);
  const [acento, setAcento] = useState<Acento>(inicial.acento);
  const [estadoDelDia, setEstadoDelDia] = useState(inicial.estadoDelDia ?? '');
  const [frase, setFrase] = useState(inicial.frase ?? '');
  const [bio, setBio] = useState(inicial.bio);
  const [credenciales, setCredenciales] = useState<Credencial[]>(
    inicial.credenciales,
  );
  const [trabajaEn, setTrabajaEn] = useState(inicial.trabajaEn.join(', '));
  const [trabajaCon, setTrabajaCon] = useState<string[]>(inicial.trabajaCon);
  const [oficina, setOficina] = useState(inicial.contacto.oficina ?? '');
  const [horario, setHorario] = useState(inicial.contacto.horario ?? '');
  const [extension, setExtension] = useState(inicial.contacto.extension ?? '');
  const [email, setEmail] = useState(inicial.contacto.email ?? '');

  const vista: Perfil = {
    ...inicial,
    nombre: nombre || 'Nombre Apellido',
    puesto: puesto || 'Puesto',
    escuela,
    acento,
    estadoDelDia: estadoDelDia || null,
    frase: frase || null,
    bio,
    credenciales,
    trabajaEn: trabajaEn
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };

  function guardar(publicar: boolean) {
    setError(null);
    empezar(async () => {
      const r = await guardarPerfil({
        id: inicial.id,
        nombre,
        puesto,
        escuela,
        slug: direccion,
        acento,
        estadoDelDia: estadoDelDia || null,
        frase: frase || null,
        bio,
        credenciales,
        trabajaEn: vista.trabajaEn,
        trabajaCon,
        contacto: {
          email: email || null,
          extension: extension || null,
          oficina: oficina || null,
          horario: horario || null,
        },
        publicar,
      });
      if (r.ok) {
        setOk(publicar ? 'Publicado.' : 'Borrador guardado.');
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
          <label htmlFor="nombre" className="text-tinta block font-semibold">
            Nombre
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (!tocoDireccion) setDireccion(aDireccion(e.target.value));
            }}
            className={`${campo} text-[17px]`}
          />
        </div>

        <div>
          <label htmlFor="puesto" className="text-tinta block font-semibold">
            Puesto
          </label>
          <input
            id="puesto"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            placeholder="Consejera Escolar"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="escuela" className="text-tinta block font-semibold">
            Escuela
          </label>
          <input
            id="escuela"
            value={escuela}
            onChange={(e) => setEscuela(e.target.value)}
            className={campo}
          />
        </div>

        <fieldset>
          <legend className="text-tinta font-semibold">Tu color</legend>
          <p className="text-gris mt-1 text-sm">
            Aparece en tu foto, tus etiquetas y tu tarjeta del Pasillo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACENTOS.map((a) => (
              <label
                key={a}
                className={`cursor-pointer rounded-xl border-2 p-1 ${
                  acento === a ? 'border-azul-700' : 'border-borde'
                }`}
              >
                <input
                  type="radio"
                  name="acento"
                  className="sr-only"
                  checked={acento === a}
                  onChange={() => setAcento(a)}
                />
                <span
                  className={`block h-9 w-14 rounded-lg ${BANDA_ACENTO[a]}`}
                />
                <span className="sr-only">{a}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="estado" className="text-tinta block font-semibold">
            Estado de hoy (opcional)
          </label>
          <input
            id="estado"
            value={estadoDelDia}
            onChange={(e) => setEstadoDelDia(e.target.value)}
            placeholder="Hoy: aceptando citas"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="frase" className="text-tinta block font-semibold">
            Una frase tuya (opcional)
          </label>
          <input
            id="frase"
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            className={campo}
          />
        </div>

        <div>
          <span className="text-tinta block font-semibold">Sobre mí</span>
          <div className="mt-2">
            <EditorTexto
              valor={inicial.bio}
              alCambiar={setBio}
              etiqueta="Sobre mí"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-tinta font-semibold">Credenciales</legend>
          <div className="mt-3 space-y-3">
            {credenciales.map((c, i) => (
              <div
                key={i}
                className="border-borde rounded-xl border bg-white p-3"
              >
                <input
                  value={c.titulo}
                  onChange={(e) =>
                    setCredenciales((cs) =>
                      cs.map((x, j) =>
                        j === i ? { ...x, titulo: e.target.value } : x,
                      ),
                    )
                  }
                  placeholder="M.A. en Consejería"
                  className="border-borde w-full rounded-lg border px-3 py-2"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    value={c.institucion}
                    onChange={(e) =>
                      setCredenciales((cs) =>
                        cs.map((x, j) =>
                          j === i ? { ...x, institucion: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Universidad"
                    className="border-borde min-w-0 flex-1 rounded-lg border px-3 py-2"
                  />
                  <input
                    value={c.anio ?? ''}
                    onChange={(e) =>
                      setCredenciales((cs) =>
                        cs.map((x, j) =>
                          j === i
                            ? { ...x, anio: Number(e.target.value) || null }
                            : x,
                        ),
                      )
                    }
                    placeholder="Año"
                    inputMode="numeric"
                    className="border-borde w-24 rounded-lg border px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCredenciales((cs) => cs.filter((_, j) => j !== i))
                  }
                  className="text-gris hover:text-rosa-700 mt-2 rounded text-sm underline"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setCredenciales((cs) => [
                ...cs,
                { titulo: '', institucion: '', anio: null },
              ])
            }
            className="border-azul-700 text-azul-700 hover:bg-azul-100 mt-3 rounded-lg border-2 px-4 py-2 font-semibold"
          >
            + Añadir credencial
          </button>
        </fieldset>

        <div>
          <label htmlFor="trabajaEn" className="text-tinta block font-semibold">
            Trabaja en
          </label>
          <input
            id="trabajaEn"
            value={trabajaEn}
            onChange={(e) => setTrabajaEn(e.target.value)}
            placeholder="Orientación vocacional, Becas"
            className={campo}
          />
        </div>

        <fieldset>
          <legend className="text-tinta font-semibold">Trabaja con</legend>
          <p className="text-gris mt-1 text-sm">
            Se pone en los dos perfiles automáticamente: si marcas a alguien, tú
            apareces también en el suyo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {otros.map((p) => {
              const marcado = trabajaCon.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 text-sm ${
                    marcado
                      ? 'border-azul-700 bg-azul-700 text-white'
                      : 'border-borde text-tinta bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={marcado}
                    onChange={() =>
                      setTrabajaCon((t) =>
                        marcado ? t.filter((x) => x !== p.id) : [...t, p.id],
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
            /consejered/{direccion || '…'}
          </p>
        </details>

        <div className="border-borde rounded-xl border bg-white p-4">
          <p className="text-tinta font-semibold">Cómo encontrarte</p>
          <label htmlFor="oficina" className="text-gris mt-3 block text-sm">
            ¿Dónde estás? Mejor una referencia que un número de salón.
          </label>
          <input
            id="oficina"
            value={oficina}
            onChange={(e) => setOficina(e.target.value)}
            placeholder="Salón 12, al lado de la biblioteca"
            className={campo}
          />
          <label htmlFor="horario" className="text-gris mt-3 block text-sm">
            Horario
          </label>
          <input
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            placeholder="Lunes a jueves, 8:00–11:00 am"
            className={campo}
          />
          <div className="mt-3 flex gap-3">
            <div className="w-32">
              <label htmlFor="ext" className="text-gris block text-sm">
                Extensión
              </label>
              <input
                id="ext"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className={campo}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="email" className="text-gris block text-sm">
                Correo (opcional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={campo}
              />
            </div>
          </div>
        </div>
      </div>

      <VistaPrevia>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <FotoPerfil perfil={vista} tamano="normal" />
            <div className="min-w-0">
              <p className="font-titulo text-azul-900 text-xl font-bold">
                {vista.nombre}
              </p>
              <p className="text-tinta">{vista.puesto}</p>
              <p className="text-gris text-sm">{vista.escuela}</p>
            </div>
          </div>
          {vista.estadoDelDia ? (
            <p
              className={`text-tinta mt-4 rounded-lg px-3 py-2 text-sm ${TINTE_ACENTO[acento]}`}
            >
              {vista.estadoDelDia}
            </p>
          ) : null}
          {vista.frase ? (
            <blockquote
              className={`text-tinta mt-4 rounded-lg px-4 py-3 italic ${TINTE_ACENTO[acento]}`}
            >
              {vista.frase}
            </blockquote>
          ) : null}
          <div
            className="text-tinta mt-4 space-y-3 [&_li]:ml-5 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: bio }}
          />
          {vista.credenciales.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-sm">
              {vista.credenciales.map((c, i) => (
                <li key={i} className="border-borde border-b pb-1.5">
                  <span className="text-tinta font-medium">{c.titulo}</span>{' '}
                  <span className="text-gris">
                    {c.institucion}
                    {c.anio ? ` · ${c.anio}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-4 flex flex-wrap gap-2">
            {vista.trabajaEn.map((t) => (
              <li
                key={t}
                className={`text-tinta rounded-full px-3 py-1 text-sm ${TINTE_ACENTO[acento]}`}
              >
                {t}
              </li>
            ))}
          </ul>
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
            disabled={pendiente || !nombre.trim() || !puesto.trim()}
            className="bg-azul-700 hover:bg-azul-900 rounded-xl px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {pendiente ? 'Guardando…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
