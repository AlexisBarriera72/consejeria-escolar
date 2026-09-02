import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  abrirSesion,
  claveCorrecta,
  excedeLimite,
  hayClaveConfigurada,
} from '@/lib/acceso';

const Cuerpo = z.object({ clave: z.string().min(1).max(200) });

/**
 * Entrar al panel con la contraseña.
 *
 * La comprobación vive AQUÍ, en el servidor. Una contraseña comparada en el
 * navegador es pública: cualquiera abre las herramientas de desarrollo y la
 * lee del bundle. Es el error más común al montar un panel casero.
 *
 * La respuesta no distingue entre "contraseña incorrecta" y "no hay ninguna
 * configurada": los dos casos devuelven lo mismo, para no contarle a nadie en
 * qué estado está el sitio.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'sin-ip';

  // El límite se cuenta ANTES de comprobar nada: si no, un atacante sabría
  // por el tiempo de respuesta si acertó el formato.
  if (excedeLimite(`ip:${ip}`)) {
    return NextResponse.json({ ok: false, motivo: 'limite' }, { status: 429 });
  }

  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success || !hayClaveConfigurada()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!claveCorrecta(datos.data.clave)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await abrirSesion();
  return NextResponse.json({ ok: true });
}
