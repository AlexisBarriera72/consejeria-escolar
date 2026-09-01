'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AvatarGuia, type Pose } from './AvatarGuia';
import { BurbujaDialogo } from './BurbujaDialogo';
import { useRol } from './ProveedorRol';
import { ORDEN_SECCIONES, type ClaveSeccion, type Rol } from '@/lib/rol';
import { BANDA_ACENTO, TINTE_ACENTO, type Acento } from './ui/Tarjeta';

export type Vistas = {
  guias: string[];
  noticias: { titulo: string; fecha: string }[];
  consejered: { nombre: string; puesto: string }[];
};

const SECCIONES: Record<
  ClaveSeccion,
  { titulo: string; href: string; acento: Acento }
> = {
  guias: { titulo: 'Preguntas y Guías', href: '/guias', acento: 'turquesa' },
  noticias: { titulo: 'Noticias', href: '/noticias', acento: 'rosa' },
  consejered: {
    titulo: 'Profesionales',
    href: '/consejered',
    acento: 'naranja',
  },
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

const POSES: Pose[] = ['izquierda', 'centro', 'derecha'];

export function Inicio({ vistas }: { vistas: Vistas }) {
  const { rol } = useRol();
  const [activa, setActiva] = useState<number | null>(null);

  const rolEfectivo: Rol = rol ?? 'invitado';
  const orden = ORDEN_SECCIONES[rolEfectivo];
  const pose: Pose = activa === null ? 'neutral' : (POSES[activa] ?? 'neutral');
  const claveActiva = activa === null ? null : orden[activa];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-titulo text-azul-900 text-4xl font-bold sm:text-5xl">
          Consejería Escolar
        </h1>
        <p className="text-tinta mt-2 text-xl font-medium">
          Sra. [Nombre Apellido]
        </p>
        <p className="text-gris mt-1">Escuela Superior [Nombre]</p>
      </div>

      {/* ── Avatar ──────────────────────────────────────────────────────── */}
      <div className="relative mt-10 flex justify-center">
        <AvatarGuia pose={pose} className="h-44 w-auto sm:h-56" />

        {/* Burbuja de escritorio: una sola, sigue al cursor o al foco.
            Oculta en móvil, donde el hover no existe. */}
        <div className="pointer-events-none absolute top-2 left-1/2 hidden w-72 md:block">
          {claveActiva ? (
            <BurbujaDialogo
              key={claveActiva}
              texto={BURBUJA[claveActiva][rolEfectivo]}
            />
          ) : (
            <div className="border-borde text-gris rounded-2xl border border-dashed px-5 py-4 text-sm">
              Pasa por encima de una tarjeta y te digo qué encuentras ahí.
            </div>
          )}
        </div>
      </div>

      {/* ── Tarjetas ────────────────────────────────────────────────────── */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {orden.map((clave, i) => {
          const s = SECCIONES[clave];
          return (
            <div key={clave} className="relative">
              {/* Burbuja de móvil: una por tarjeta, siempre visible.
                  En una pantalla táctil no hay "pasar por encima": un
                  tooltip que depende del hover es invisible para todo el
                  mundo que entra desde el teléfono. */}
              <p className="border-borde text-gris mb-2 rounded-xl border bg-white px-3 py-2 text-sm md:hidden">
                {BURBUJA[clave][rolEfectivo]}
              </p>

              <Link
                href={s.href}
                onMouseEnter={() => setActiva(i)}
                onMouseLeave={() => setActiva(null)}
                // El foco de teclado mueve el brazo igual que el ratón. Si
                // solo respondiera al hover, quien navega con Tab no vería
                // nunca la explicación.
                onFocus={() => setActiva(i)}
                onBlur={() => setActiva(null)}
                className={`border-borde block overflow-hidden rounded-2xl border bg-white transition-transform ${
                  activa === i ? 'md:-translate-y-1 md:shadow-lg' : ''
                }`}
              >
                <div
                  className={`${BANDA_ACENTO[s.acento]} ${
                    activa === i ? 'h-3' : 'h-2'
                  } transition-all`}
                />
                <div className="p-5">
                  <h2 className="font-titulo text-azul-900 text-xl font-bold">
                    {s.titulo}
                  </h2>
                </div>
              </Link>

              {/* Vista previa: datos reales, no relleno. Es lo que hace que
                  la portada parezca viva en vez de un menú. */}
              <div
                className={`mt-2 rounded-xl px-4 py-3 ${TINTE_ACENTO[s.acento]}`}
              >
                <VistaPrevia clave={clave} vistas={vistas} />
              </div>
            </div>
          );
        })}
      </div>
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
  if (clave === 'guias') {
    return (
      <ul className="text-tinta space-y-1 text-sm">
        {vistas.guias.map((t) => (
          <li key={t} className="truncate">
            · {t}
          </li>
        ))}
      </ul>
    );
  }
  if (clave === 'noticias') {
    return (
      <ul className="text-tinta space-y-1.5 text-sm">
        {vistas.noticias.map((n) => (
          <li key={n.titulo + n.fecha} className="truncate">
            <span className="text-gris">{n.fecha}</span> — {n.titulo}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="text-tinta space-y-1 text-sm">
      {vistas.consejered.map((p) => (
        <li key={p.nombre} className="truncate">
          · {p.nombre} <span className="text-gris">— {p.puesto}</span>
        </li>
      ))}
    </ul>
  );
}
