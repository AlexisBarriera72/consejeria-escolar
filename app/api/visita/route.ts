import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { contarVisita } from '@/lib/estadisticas';

const Cuerpo = z.object({
  rol: z.enum(['estudiante', 'encargado', 'invitado']),
});

/**
 * Suma uno al contador del mes.
 *
 * Lo que llega es una palabra de tres posibles. No se lee la IP, no se pone
 * cookie, no se guarda nada más. El navegador se acuerda de que ya contó
 * este mes (localStorage) para no inflar el número, y esa marca tampoco sale
 * de su equipo.
 *
 * Responde 204 siempre, incluso si algo falla: que el contador se caiga no
 * puede estropearle la visita a nadie.
 */
export async function POST(req: NextRequest) {
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (datos.success) {
    try {
      await contarVisita(datos.data.rol);
    } catch {
      /* el contador no vale una página rota */
    }
  }
  return new NextResponse(null, { status: 204 });
}
