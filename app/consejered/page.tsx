import type { Metadata } from 'next';
import { TarjetaPerfil } from '@/components/TarjetaPerfil';
import { obtenerPerfiles } from '@/lib/contenido';
import { EncabezadoSeccion, MetaCifra } from '@/components/EncabezadoSeccion';

export const metadata: Metadata = {
  title: 'El equipo',
  description:
    'El equipo de la oficina de consejería: quiénes son y dónde encontrarlos.',
};

export default async function PaginaPasillo() {
  const perfiles = await obtenerPerfiles();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <EncabezadoSeccion
        cejilla="ConsejeRed"
        antes="El equipo que"
        acento="trabaja contigo"
        despues="."
        color="text-coral-700"
        lede="La pared del pasillo, pero digital. Pulsa a cualquiera para ver dónde encontrarlo y de qué se encarga."
        meta={<MetaCifra n={perfiles.length} etiqueta="personas" />}
      />

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
