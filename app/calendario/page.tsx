import type { Metadata } from 'next';
import Link from 'next/link';
import { obtenerDisponibilidad } from '@/lib/calendario';
import { obtenerPerfiles } from '@/lib/contenido';

export const metadata: Metadata = {
  title: 'Disponibilidad',
  description: 'Qué días está disponible la consejera.',
};

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V'];

export default async function PaginaCalendario() {
  const [disponibilidad, perfiles] = await Promise.all([
    obtenerDisponibilidad(),
    obtenerPerfiles(),
  ]);
  const consejera = perfiles[0] ?? null;

  // Solo de lunes a viernes: las columnas de sábado y domingo estarían
  // siempre vacías y en un teléfono ese espacio hace falta.
  const laborables = disponibilidad.ok
    ? disponibilidad.dias.filter((d) => {
        const dow = new Date(`${d.fecha}T12:00:00Z`).getUTCDay();
        return dow >= 1 && dow <= 5;
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-titulo text-azul-900 text-4xl font-bold">
        ¿Cuándo está disponible?
      </h1>
      <p className="text-gris mt-3">
        Esto no reserva una cita: es solo para que sepas cuándo pasar.
      </p>

      {disponibilidad.ok ? (
        <>
          <div className="border-borde bg-crema mt-8 rounded-2xl border p-5">
            <div className="grid grid-cols-5 gap-2">
              {DIAS_SEMANA.map((d, i) => (
                <div
                  key={i}
                  className="text-gris pb-2 text-center text-sm font-semibold"
                >
                  {d}
                </div>
              ))}
              {laborables.map((d) => {
                const dia = new Date(`${d.fecha}T12:00:00Z`).getUTCDate();
                return (
                  <div
                    key={d.fecha}
                    className="border-borde flex flex-col items-center gap-1.5 rounded-lg border py-2.5"
                  >
                    <span className="text-tinta text-sm">{dia}</span>
                    {/* La forma, no solo el color: relleno = libre, aro
                        hueco = ocupada. Quien no distingue verde de gris
                        distingue perfectamente lleno de vacío. */}
                    <span
                      aria-hidden
                      className={
                        d.ocupado
                          ? 'border-gris h-3.5 w-3.5 rounded-full border-2'
                          : 'bg-menta h-3.5 w-3.5 rounded-full'
                      }
                    />
                    <span className="sr-only">
                      {d.ocupado ? 'Ocupada' : 'Libre'}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-gris mt-4 flex flex-wrap gap-5 text-sm">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="bg-menta h-3.5 w-3.5 rounded-full"
                />
                Libre
              </span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="border-gris h-3.5 w-3.5 rounded-full border-2"
                />
                Ocupada
              </span>
            </p>
          </div>
        </>
      ) : (
        // Nunca se enseña un calendario viejo como si fuera de hoy: si no se
        // pudo cargar, se dice y se da la información fija, que sí es cierta.
        <p className="text-gris border-borde mt-8 rounded-2xl border border-dashed p-6 text-center text-sm">
          {disponibilidad.motivo === 'sin-configurar'
            ? 'El calendario todavía no está conectado.'
            : 'No pudimos cargar el calendario en este momento.'}
        </p>
      )}

      {consejera ? (
        <div className="bg-azul-100/50 mt-6 rounded-2xl p-5">
          <p className="text-tinta font-semibold">{consejera.nombre}</p>
          {consejera.contacto.oficina ? (
            <p className="text-tinta mt-1">{consejera.contacto.oficina}</p>
          ) : null}
          {consejera.contacto.horario ? (
            <p className="text-tinta">{consejera.contacto.horario}</p>
          ) : null}
          <p className="text-gris mt-3 text-sm">
            Confirma con ella antes de venir.
          </p>
          <Link
            href={`/consejered/${consejera.slug}`}
            className="text-azul-700 mt-3 inline-block rounded text-sm underline"
          >
            Ver su perfil
          </Link>
        </div>
      ) : null}
    </div>
  );
}
