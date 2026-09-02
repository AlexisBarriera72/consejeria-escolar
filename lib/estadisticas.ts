import 'server-only';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Rol } from './rol';

/**
 * El contador mensual (doc 09 §1).
 *
 * Guarda EXCLUSIVAMENTE números:
 *
 *     { "2026-09": { "estudiante": 412, "encargado": 87, "invitado": 55 } }
 *
 * Ni nombres, ni correos, ni direcciones IP, ni identificadores de sesión.
 * No es que se anonimice después: es que nunca se recoge nada con lo que
 * identificar a nadie. Por construcción, este archivo no puede señalar a un
 * estudiante concreto.
 *
 * Es la respuesta completa a "quiero saber cuánta gente visita el sitio cada
 * mes" sin ninguna de las consecuencias de guardar datos de menores.
 *
 * Con Upstash configurado, un INCR. Sin él, un archivo JSON local — que en
 * Vercel no persiste, así que en producción hace falta Upstash de verdad.
 */

export type Conteo = Record<Rol, number>;
export type PorMes = Record<string, Partial<Conteo>>;

const LOCAL = join(process.cwd(), 'contenido', '.estadisticas.json');

function claveMes(fecha = new Date()): string {
  return fecha.toISOString().slice(0, 7); // AAAA-MM
}

function usaUpstash(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

async function upstash(comando: string[]): Promise<unknown> {
  const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comando),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const cuerpo = (await res.json()) as { result: unknown };
  return cuerpo.result;
}

async function leerLocal(): Promise<PorMes> {
  try {
    return JSON.parse(await readFile(LOCAL, 'utf8')) as PorMes;
  } catch {
    return {};
  }
}

export async function contarVisita(rol: Rol): Promise<void> {
  const mes = claveMes();
  if (usaUpstash()) {
    await upstash(['HINCRBY', `stats:${mes}`, rol, '1']);
    return;
  }
  const datos = await leerLocal();
  const delMes = datos[mes] ?? {};
  delMes[rol] = (delMes[rol] ?? 0) + 1;
  datos[mes] = delMes;
  await mkdir(join(process.cwd(), 'contenido'), { recursive: true });
  await writeFile(LOCAL, JSON.stringify(datos, null, 2) + '\n', 'utf8');
}

export async function obtenerEstadisticas(meses = 12): Promise<PorMes> {
  if (!usaUpstash()) return leerLocal();

  const resultado: PorMes = {};
  const hoy = new Date();
  for (let i = 0; i < meses; i++) {
    const d = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - i, 1),
    );
    const mes = claveMes(d);
    const crudo = (await upstash(['HGETALL', `stats:${mes}`])) as
      Record<string, string> | string[] | null;
    if (!crudo) continue;
    // Upstash devuelve pares planos o un objeto según la versión.
    const pares = Array.isArray(crudo)
      ? Object.fromEntries(
          crudo.reduce<[string, string][]>(
            (acc, v, idx, arr) =>
              idx % 2 === 0 ? [...acc, [v, arr[idx + 1] ?? '0']] : acc,
            [],
          ),
        )
      : crudo;
    const conteo: Partial<Conteo> = {};
    for (const [k, v] of Object.entries(pares)) {
      conteo[k as Rol] = Number(v) || 0;
    }
    if (Object.keys(conteo).length > 0) resultado[mes] = conteo;
  }
  return resultado;
}

/** CSV para la hoja de cálculo mensual, que es lo que se pidió. */
export function aCsv(datos: PorMes): string {
  const filas = [['Mes', 'Estudiantes', 'Encargados', 'Invitados', 'Total']];
  for (const mes of Object.keys(datos).sort().reverse()) {
    const c = datos[mes] ?? {};
    const e = c.estudiante ?? 0;
    const n = c.encargado ?? 0;
    const i = c.invitado ?? 0;
    filas.push([mes, String(e), String(n), String(i), String(e + n + i)]);
  }
  return filas.map((f) => f.join(',')).join('\n') + '\n';
}
