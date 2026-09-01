import { NextResponse, type NextRequest } from 'next/server';
import { abrirSesion, esPersonal, leerToken, quemarToken } from '@/lib/acceso';

/**
 * Abre la sesión al pulsar el enlace del correo.
 *
 * Falla, y siempre igual, si: la firma no cuadra, el token venció, ya se usó,
 * o la persona ya no está en la lista del personal. Un mensaje de error
 * distinto para cada caso le diría a un atacante en cuál se está acercando.
 */
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') ?? undefined;
  const datos = leerToken(token);

  const invalido = NextResponse.redirect(
    new URL('/edit?error=invalido', req.url),
  );

  if (!datos || datos.tipo !== 'enlace') return invalido;
  if (!esPersonal(datos.correo)) return invalido;
  if (!quemarToken(datos.jti)) return invalido; // ya se usó

  await abrirSesion(datos.correo);
  return NextResponse.redirect(new URL('/edit/panel', req.url));
}
