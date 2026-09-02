import 'server-only';
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Acceso al panel con UNA contraseña.
 *
 * Antes esto era un enlace mágico por correo. Se cambió porque el producto
 * cambió: edita una sola persona (PRODUCT.md), no un equipo. Con un solo
 * editor, el enlace por correo añadía dos dependencias — un proveedor de
 * envío y la bandeja de entrada — para resolver un problema que no existía:
 * saber cuál de varias personas hizo cada cambio.
 *
 * Lo que se conserva del diseño anterior, porque sigue siendo lo correcto:
 *
 *  · La contraseña NO se guarda. Se guarda un hash scrypt con sal, así que
 *    ver la variable de entorno no basta para entrar.
 *  · La comparación es en tiempo constante. Un `===` se rinde en el primer
 *    byte distinto y esa diferencia es medible desde fuera.
 *  · La cookie de sesión va firmada y es HttpOnly: el navegador no la puede
 *    fabricar ni leerla desde JavaScript.
 *  · CADA ruta que escribe vuelve a comprobar la sesión. Esconder la página
 *    no sirve de nada si la acción que guarda está abierta.
 *
 * Lo que CAMBIA de verdad al pasar a contraseña: una contraseña sí se puede
 * adivinar a fuerza bruta, cosa que un enlace de un solo uso no. Por eso el
 * límite de intentos deja de ser un adorno y pasa a ser la defensa principal.
 */

const NOMBRE_COOKIE = 'sesion';
const VIDA_SESION_MS = 8 * 60 * 60 * 1000; // un turno escolar

function secreto(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      'SESSION_SECRET no está puesto o es muy corto (mínimo 32 caracteres). ' +
        'Genera uno con: node scripts/generar-clave.mjs',
    );
  }
  return s;
}

/** Nombre que aparece en "Editado por…" y en la franja del panel. */
export function nombreDelPersonal(): string {
  return process.env.ADMIN_NOMBRE?.trim() || 'Consejería Escolar';
}

// ── La contraseña ──────────────────────────────────────────────────────────

type Guardada = { sal: Buffer; hash: Buffer };

/**
 * Formato de ADMIN_PASSWORD_HASH: scrypt:salHex:hashHex
 *
 * El separador es dos puntos, NO el dólar que se estila en este tipo de
 * cadenas. Next pasa los .env por dotenv-expand, que lee un dólar seguido de
 * caracteres como el nombre de una variable y lo sustituye por vacío. Con el
 * formato habitual el hash llegaba partido y el panel devolvía 401 sin decir
 * por qué — media hora de depuración que este comentario evita.
 */
function claveGuardada(): Guardada | null {
  const crudo = process.env.ADMIN_PASSWORD_HASH;
  if (!crudo) return null;
  const partes = crudo.split(':');
  if (partes.length !== 3 || partes[0] !== 'scrypt') return null;
  try {
    return {
      sal: Buffer.from(partes[1]!, 'hex'),
      hash: Buffer.from(partes[2]!, 'hex'),
    };
  } catch {
    return null;
  }
}

export function hayClaveConfigurada(): boolean {
  return claveGuardada() !== null;
}

export function claveCorrecta(clave: string): boolean {
  const guardada = claveGuardada();
  if (!guardada) return false;
  const intento = scryptSync(clave, guardada.sal, guardada.hash.length);
  if (intento.length !== guardada.hash.length) return false;
  return timingSafeEqual(intento, guardada.hash);
}

/**
 * Huella corta del hash, guardada dentro de la sesión.
 *
 * Sirve para que cambiar la contraseña cierre las sesiones abiertas: si la
 * huella de la cookie no coincide con la del hash actual, la cookie deja de
 * valer. Sin esto, cambiar la contraseña porque alguien la vio no echaría a
 * quien ya estuviera dentro.
 */
function huella(): string {
  const g = claveGuardada();
  return g ? g.hash.toString('hex').slice(0, 12) : '';
}

// ── Sesión ─────────────────────────────────────────────────────────────────

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

type Carga = { usuario: string; exp: number; huella: string };

export async function abrirSesion(): Promise<void> {
  const carga: Carga = {
    usuario: nombreDelPersonal(),
    exp: Date.now() + VIDA_SESION_MS,
    huella: huella(),
  };
  const cuerpo = b64(JSON.stringify(carga));
  const galletas = await cookies();
  galletas.set(NOMBRE_COOKIE, `${cuerpo}.${firmar(cuerpo)}`, {
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

export type Sesion = { usuario: string; expira: number };

/** La única función que decide si alguien está dentro. */
export async function sesionActiva(): Promise<Sesion | null> {
  const galletas = await cookies();
  const token = galletas.get(NOMBRE_COOKIE)?.value;
  if (!token || !token.includes('.')) return null;

  const [cuerpo, firma] = token.split('.');
  if (!cuerpo || !firma || !firmaValida(cuerpo, firma)) return null;

  try {
    const datos = JSON.parse(deB64(cuerpo)) as Carga;
    if (Date.now() > datos.exp) return null;
    // Si cambió la contraseña, las cookies viejas dejan de valer.
    if (!datos.huella || datos.huella !== huella()) return null;
    return { usuario: datos.usuario, expira: datos.exp };
  } catch {
    return null;
  }
}

export async function exigirSesion(): Promise<Sesion> {
  const s = await sesionActiva();
  if (!s) throw new Error('SIN_SESION');
  return s;
}

// ── Límite de intentos ─────────────────────────────────────────────────────
//
// Con enlace mágico esto era una molestia para el atacante. Con contraseña es
// LA defensa: sin límite, un script prueba miles por minuto. Diez intentos
// cada cuarto de hora hacen la fuerza bruta inviable y no le estorban a quien
// entra un par de veces por semana.
//
// En memoria: en serverless cada instancia lleva su cuenta, así que el límite
// real es algo más alto que 10. Para cerrarlo del todo habría que llevarlo a
// Upstash, que ya está en el proyecto para las estadísticas.

const VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 10;

const intentos = new Map<string, { n: number; desde: number }>();

export function excedeLimite(clave: string): boolean {
  const ahora = Date.now();
  const reg = intentos.get(clave);
  if (!reg || ahora - reg.desde > VENTANA_MS) {
    intentos.set(clave, { n: 1, desde: ahora });
    return false;
  }
  reg.n += 1;
  return reg.n > MAX_INTENTOS;
}

export const LIMITES = { intentos: MAX_INTENTOS, ventanaMin: 15 };

/** Genera un secreto de sesión. Lo usa scripts/generar-clave.mjs. */
export function nuevoSecreto(): string {
  return randomBytes(32).toString('hex');
}
