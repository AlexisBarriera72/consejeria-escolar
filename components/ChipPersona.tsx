import Link from 'next/link';
import type { Perfil } from '@/lib/tipos';
import { FotoPerfil } from './FotoPerfil';
import { BORDE_ACENTO, TINTE_ACENTO } from './ui/Tarjeta';

/**
 * La persona a la que preguntar sobre este tema.
 *
 * Enlaza al perfil, no a un correo. Un estudiante que duda si escribir
 * necesita antes saber quién es esa persona, qué hace y dónde está — no un
 * cliente de correo abriéndose de golpe.
 */
export function ChipPersona({ perfil }: { perfil: Perfil }) {
  return (
    <Link
      href={`/consejered/${perfil.slug}`}
      className={`inline-flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-sm transition-shadow hover:shadow-sm ${BORDE_ACENTO[perfil.acento]} ${TINTE_ACENTO[perfil.acento]}`}
    >
      <FotoPerfil perfil={perfil} tamano="mini" />
      <span className="text-tinta font-medium">{perfil.nombre}</span>
    </Link>
  );
}
