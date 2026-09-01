import Link from 'next/link';
import { obtenerAviso } from '@/lib/contenido';

/**
 * El aviso de emergencia.
 *
 * Un interruptor, una línea de texto, encima de todo, en todas las páginas.
 * En Puerto Rico esto no es hipotético: cuando cierra la escuela por un aviso
 * de huracán, esta franja es lo único de todo el sitio que importa.
 *
 * Por eso es lo primero dentro del <body> y no depende de JavaScript: se
 * pinta en el servidor y está ahí aunque no cargue nada más.
 */
export async function BannerAviso() {
  const aviso = await obtenerAviso();
  if (!aviso.activo || !aviso.mensaje) return null;

  const urgente = aviso.nivel === 'urgente';

  return (
    <div
      // role="alert" hace que un lector de pantalla lo anuncie al entrar,
      // sin esperar a que alguien llegue navegando hasta ahí.
      role="alert"
      className={
        urgente
          ? 'bg-rosa-700 text-white'
          : 'bg-ambar text-tinta' /* ámbar solo lleva tinta: 10.15:1 */
      }
    >
      <p className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 font-medium">
        <span aria-hidden>{urgente ? '⚠' : 'ℹ'}</span>
        <span>{aviso.mensaje}</span>
        {aviso.enlace ? (
          <Link href={aviso.enlace} className="rounded underline">
            Más información
          </Link>
        ) : null}
      </p>
    </div>
  );
}
