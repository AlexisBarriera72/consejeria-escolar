import Image from 'next/image';
import type { Perfil } from '@/lib/tipos';
import { BANDA_ACENTO, BORDE_ACENTO } from './ui/Tarjeta';

/** "María Rivera" → "MR". Una sola palabra → una sola letra. */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primera = partes[0]?.[0] ?? '';
  const ultima =
    partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : '';
  return (primera + ultima).toUpperCase();
}

/**
 * Foto del perfil, o un mosaico con las iniciales si no hay.
 *
 * El respaldo no es un caso raro: alguien del personal puede no querer salir
 * en foto, y esa decisión merece verse tan cuidada como una foto. Un icono
 * gris de "usuario sin imagen" dice "aquí falta algo"; un mosaico con sus
 * iniciales en su color dice "así es como esta persona aparece".
 */
export function FotoPerfil({
  perfil,
  tamano = 'normal',
}: {
  perfil: Perfil;
  tamano?: 'normal' | 'grande' | 'chica' | 'mini';
}) {
  const medidas = {
    // 'mini' existe porque sin él cada sitio que necesitaba un avatar
    // pequeño lo metía en una caja más chica que el propio mosaico y lo
    // recortaba. Ese era el bug de las iniciales rotas.
    mini: 'h-8 w-8 text-[0.65rem] border',
    chica: 'h-14 w-14 text-lg border-2',
    normal: 'h-24 w-24 text-2xl border-4',
    grande: 'h-full w-full aspect-square text-6xl border-8',
  }[tamano];

  if (perfil.foto) {
    return (
      <Image
        src={perfil.foto.url}
        alt={perfil.foto.alt}
        width={perfil.foto.ancho}
        height={perfil.foto.alto}
        className={`${medidas} ${BORDE_ACENTO[perfil.acento]} rounded-2xl object-cover`}
        style={{
          objectPosition: `${perfil.foto.focoX * 100}% ${perfil.foto.focoY * 100}%`,
        }}
      />
    );
  }

  return (
    <div
      className={`${medidas} ${BANDA_ACENTO[perfil.acento]} text-tinta grid place-items-center rounded-2xl border-white font-bold`}
      // El nombre completo ya está escrito al lado en todos los usos, así
      // que para un lector de pantalla esto es decoración repetida.
      aria-hidden
    >
      {iniciales(perfil.nombre)}
    </div>
  );
}
