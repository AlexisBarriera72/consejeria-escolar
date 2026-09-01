import Link from 'next/link';
import type { Perfil } from '@/lib/tipos';
import { FotoPerfil } from './FotoPerfil';
import { BORDE_ACENTO, TINTE_ACENTO } from './ui/Tarjeta';

/** Inclinaciones fijas, no aleatorias. Un Math.random() daría un ángulo en
 *  el servidor y otro en el cliente, y React se quejaría de que el HTML no
 *  coincide. Además así la pared se ve igual en cada visita. */
const GIROS = [-1.6, 1.1, -0.7, 1.5, -1.2, 0.9];

export function TarjetaPerfil({
  perfil,
  indice = 0,
}: {
  perfil: Perfil;
  indice?: number;
}) {
  const giro = GIROS[indice % GIROS.length] ?? 0;

  return (
    <Link
      href={`/consejered/${perfil.slug}`}
      style={{ rotate: `${giro}deg` }}
      className={`block rounded-2xl border-2 bg-white p-5 transition-transform hover:rotate-0 hover:shadow-lg ${BORDE_ACENTO[perfil.acento]}`}
    >
      {/* La chincheta de la pared del pasillo */}
      <div
        aria-hidden
        className="bg-gris/40 mx-auto mb-3 h-2.5 w-2.5 rounded-full"
      />
      <div className="flex items-center gap-4">
        <FotoPerfil perfil={perfil} tamano="chica" />
        <div className="min-w-0">
          <p className="font-titulo text-azul-900 truncate text-lg font-bold">
            {perfil.nombre}
          </p>
          <p className="text-gris truncate text-sm">{perfil.puesto}</p>
        </div>
      </div>

      {perfil.estadoDelDia ? (
        <p
          className={`text-tinta mt-4 rounded-lg px-3 py-1.5 text-sm ${TINTE_ACENTO[perfil.acento]}`}
        >
          {perfil.estadoDelDia}
        </p>
      ) : null}

      {perfil.contacto.oficina ? (
        <p className="text-gris mt-3 text-sm">{perfil.contacto.oficina}</p>
      ) : null}
    </Link>
  );
}
