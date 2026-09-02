import Link from 'next/link';
import type { Perfil } from '@/lib/tipos';
import { FotoPerfil } from './FotoPerfil';
import { BANDA_ACENTO } from './ui/Tarjeta';

/**
 * Una ficha clavada en el tablón de corcho.
 *
 * Inclinaciones y desplazamientos FIJOS, no aleatorios: Math.random() daría
 * un ángulo en el servidor y otro en el cliente y React se quejaría de que el
 * HTML no coincide. Fijos además significa que el tablón se ve igual en cada
 * visita, como una pared de verdad donde los papeles no se mueven solos.
 */
const GIROS = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2, -2.6, 0.9];
const ALTURAS = ['sm:mt-0', 'sm:mt-8', 'sm:mt-3', 'sm:mt-10', 'sm:mt-1'];

export function TarjetaPerfil({
  perfil,
  indice = 0,
}: {
  perfil: Perfil;
  indice?: number;
}) {
  const giro = GIROS[indice % GIROS.length] ?? 0;
  const alto = ALTURAS[indice % ALTURAS.length] ?? '';

  return (
    <div className={alto}>
      <Link
        href={`/consejered/${perfil.slug}`}
        style={{ rotate: `${giro}deg` }}
        className="bg-crema group relative block rounded-sm px-5 pt-8 pb-5 shadow-[0_10px_22px_-8px_rgba(0,0,0,.45)] transition-transform hover:scale-[1.02] hover:rotate-0"
      >
        {/* La chincheta. Aguja fina detrás, cabeza redonda delante. */}
        <span aria-hidden className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span
            className={`block h-5 w-5 rounded-full ${BANDA_ACENTO[perfil.acento]} shadow-[0_2px_4px_rgba(0,0,0,.4)] ring-2 ring-black/10`}
          />
          <span className="mx-auto block h-2 w-[3px] bg-black/25" />
        </span>

        <div className="flex items-center gap-4">
          <FotoPerfil perfil={perfil} tamano="chica" />
          <div className="min-w-0">
            <p className="font-titulo text-tinta truncate text-lg leading-tight font-bold">
              {perfil.nombre}
            </p>
            <p className="text-gris truncate text-sm">{perfil.puesto}</p>
          </div>
        </div>

        {perfil.estadoDelDia ? (
          <p className="border-tinta/15 text-tinta mt-4 border-t pt-3 text-sm">
            {perfil.estadoDelDia}
          </p>
        ) : null}

        {perfil.contacto.oficina ? (
          <p className="text-gris mt-2 text-sm leading-snug">
            {perfil.contacto.oficina}
          </p>
        ) : null}
      </Link>
    </div>
  );
}
