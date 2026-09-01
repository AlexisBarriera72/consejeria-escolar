import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Acceso al panel por enlace mágico.
 *
 * Es el prototipo de demo/magic-link/ llevado a Next, con las mismas
 * defensas y por las mismas razones:
 *
 *  · El token va firmado con HMAC-SHA256: no se puede fabricar sin el secreto.
 *  · Las firmas se comparan en tiempo constante (timingSafeEqual). Un `===`
 *    se rinde en el primer byte distinto, y esa diferencia es medible desde
 *    fuera — deja adivinar la firma byte a byte.
 *  · El enlace vence a los 10 minutos y sirve una sola vez.
 *  · La cookie de sesión es HttpOnly: el JavaScript de la página no la puede
 *    leer, así que un XSS no la puede robar.
 *  · La respuesta es IDÉNTICA exista o no el correo. Si dijera "ese correo no
 *    existe", cualquiera podría averiguar quién trabaja en la escuela
 *    probando direcciones.
 *
 * Y lo más importante, que es lo que suele fallar: CADA ruta que escribe
 * vuelve a comprobar la sesión. Esconder la página del panel no sirve de
 * nada si la ruta que guarda está abierta — los ataques van a la API, no a
 * la interfaz.
 */

const NOMBRE_COOKIE = 'sesion';
const VIDA_ENLACE_MS = 10 * 60 * 1000;
const VIDA_SESION_MS = 8 * 60 * 60 * 1000; // un turno escolar

function secreto(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      'SESSION_SECRET no está puesto o es muy corto (mínimo 32 caracteres). ' +
        "Genera uno con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return s;
}

/** El personal autorizado. Añadir o quitar a alguien es editar una variable
 *  de entorno en Vercel — no hay tabla de usuarios que mantener. */
export function personalAutorizado(): string[] {
  return (process.env.STAFF_EMAILS ?? '')
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

export function esPersonal(correo: string): boolean {
  return personalAutorizado().includes(correo.trim().toLowerCase());
}

// ── Tokens firmados ────────────────────────────────────────────────────────

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const deB64 = (s: string) => Buffer.from(s, 'base64url').toString('utf8');

function firmar(texto: string): string {
  return createHmac('sha256', secreto()).update(texto).digest('base64url');
}

function firmaValida(texto: string, recibida: string): boolean {
  const esperada = Buffer.from(firmar(texto));
  const dada = Buffer.from(String(recibida));
  if (esperada.length !== dada.length) return false;
  return timingSafeEqual(esperada, dada);
}

type Carga = {
  correo: string;
  exp: number;
  tipo: 'enlace' | 'sesion';
  jti?: string;
};

function crearToken(datos: Carga): string {
  const carga = b64(JSON.stringify(datos));
  return `${carga}.${firmar(carga)}`;
}

export function leerToken(token: string | undefined): Carga | null {
  if (!token || !token.includes('.')) return null;
  const [carga, firma] = token.split('.');
  if (!carga || !firma || !firmaValida(carga, firma)) return null;
  try {
    const datos = JSON.parse(deB64(carga)) as Carga;
    if (Date.now() > datos.exp) return null;
    return datos;
  } catch {
    return null;
  }
}

export function crearTokenEnlace(correo: string): string {
  return crearToken({
    correo: correo.toLowerCase(),
    exp: Date.now() + VIDA_ENLACE_MS,
    tipo: 'enlace',
    jti: randomBytes(9).toString('base64url'),
  });
}

// ── Un solo uso ────────────────────────────────────────────────────────────
//
// En memoria. En serverless cada instancia tiene la suya, así que un enlace
// PODRÍA reutilizarse si la segunda petición cae en otra instancia. Para dos
// personas y una ventana de 10 minutos el riesgo es despreciable; si algún
// día hace falta cerrarlo del todo, se mueve a Upstash con TTL de 10 min.
// Se deja escrito para que nadie lo descubra por sorpresa.
const usados = new Set<string>();

export function quemarToken(jti: string | undefined): boolean {
  if (!jti) return false;
  if (usados.has(jti)) return false;
  usados.add(jti);
  if (usados.size > 500) usados.clear(); // no crecer sin límite
  return true;
}

// ── Sesión ─────────────────────────────────────────────────────────────────

export async function abrirSesion(correo: string): Promise<void> {
  const token = crearToken({
    correo: correo.toLowerCase(),
    exp: Date.now() + VIDA_SESION_MS,
    tipo: 'sesion',
  });
  const galletas = await cookies();
  galletas.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: VIDA_SESION_MS / 1000,
  });
}

export async function cerrarSesion(): Promise<void> {
  const galletas = await cookies();
  galletas.delete(NOMBRE_COOKIE);
}

export type Sesion = { correo: string; expira: number };

/**
 * La única función que decide si alguien está dentro.
 * Se llama en cada página del panel Y en cada ruta que escribe.
 */
export async function sesionActiva(): Promise<Sesion | null> {
  const galletas = await cookies();
  const datos = leerToken(galletas.get(NOMBRE_COOKIE)?.value);
  if (!datos || datos.tipo !== 'sesion') return null;
  // Revocar a alguien = quitarlo de STAFF_EMAILS. Su cookie deja de valer
  // aquí mismo, sin esperar a que caduque.
  if (!esPersonal(datos.correo)) return null;
  return { correo: datos.correo, expira: datos.exp };
}

/** Para usar al principio de cada ruta de escritura. Lanza si no hay sesión. */
export async function exigirSesion(): Promise<Sesion> {
  const s = await sesionActiva();
  if (!s) throw new Error('SIN_SESION');
  return s;
}

// ── Límite de intentos ─────────────────────────────────────────────────────

const VENTANA_MS = 15 * 60 * 1000;
const MAX_CORREO = 5;
const MAX_IP = 20; // una escuela entera sale por una sola IP pública

const intentos = new Map<string, { n: number; desde: number }>();

export function excedeLimite(clave: string, maximo: number): boolean {
  const ahora = Date.now();
  const reg = intentos.get(clave);
  if (!reg || ahora - reg.desde > VENTANA_MS) {
    intentos.set(clave, { n: 1, desde: ahora });
    return false;
  }
  reg.n += 1;
  return reg.n > maximo;
}

export const LIMITES = { correo: MAX_CORREO, ip: MAX_IP };
