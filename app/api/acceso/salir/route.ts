import { NextResponse, type NextRequest } from 'next/server';
import { cerrarSesion } from '@/lib/acceso';

export async function POST(req: NextRequest) {
  await cerrarSesion();
  return NextResponse.redirect(new URL('/', req.url), { status: 303 });
}
