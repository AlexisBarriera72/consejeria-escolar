import type { Metadata } from 'next';
import { TarjetaPerfil } from '@/components/TarjetaPerfil';
import { obtenerPerfiles } from '@/lib/contenido';

export const metadata: Metadata = {
  title: 'El Pasillo',
  description:
    'El equipo de la oficina de consejería: quiénes son y dónde encontrarlos.',
};

export default async function PaginaPasillo() {
  const perfiles = await obtenerPerfiles();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-naranja text-sm font-semibold tracking-wide uppercase">
        ConsejeRed
      </p>
      <h1 className="font-titulo text-azul-900 mt-2 text-4xl font-bold">
        El Pasillo
      </h1>
      <p className="text-gris mt-3 max-w-2xl">
        El equipo que trabaja contigo. Pulsa a cualquiera para ver su perfil.
      </p>

      {perfiles.length === 0 ? (
        <p className="text-gris border-borde mt-10 rounded-2xl border border-dashed p-10 text-center">
          Todavía no hay perfiles publicados.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {perfiles.map((p, i) => (
            <TarjetaPerfil key={p.id} perfil={p} indice={i} />
          ))}
        </div>
      )}
    </div>
  );
}
