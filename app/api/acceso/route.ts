import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  LIMITES,
  crearTokenEnlace,
  esPersonal,
  excedeLimite,
} from '@/lib/acceso';
import { enviarEnlace } from '@/lib/correo';

const Cuerpo = z.object({
  correo: z.string().trim().toLowerCase().email().max(200),
});

/**
 * Pide un enlace de acceso.
 *
 * Responde SIEMPRE lo mismo — 200 y "revisa tu correo" — exista o no la
 * dirección. Es deliberado: si respondiera distinto, cualquiera podría
 * averiguar quién trabaja en la escuela probando correos.
 */
export async function POST(req: NextRequest) {
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));

  // Ni siquiera un correo mal formado recibe una respuesta distinta.
  if (!datos.success) return NextResponse.json({ ok: true });

  const correo = datos.data.correo;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'sin-ip';

  // Se evalúan las DOS antes del if: con `||` la segunda no correría cuando
  // la primera ya dio true, y ese contador quedaría desfasado.
  const ipPasada = excedeLimite(`ip:${ip}`, LIMITES.ip);
  const correoPasado = excedeLimite(`correo:${correo}`, LIMITES.correo);
  if (ipPasada || correoPasado) {
    return NextResponse.json({ ok: false, motivo: 'limite' }, { status: 429 });
  }

  if (esPersonal(correo)) {
    const token = crearTokenEnlace(correo);
    const base = process.env.NEXT_PUBLIC_SITIO_URL ?? new URL(req.url).origin;
    try {
      await enviarEnlace(correo, `${base}/api/acceso/verificar?token=${token}`);
    } catch {
      // Registrado en correo.ts. A quien pregunta se le dice lo mismo.
    }
  } else {
    console.log(`  ⚠  Intento con correo no autorizado: ${correo}`);
  }

  return NextResponse.json({ ok: true });
}
