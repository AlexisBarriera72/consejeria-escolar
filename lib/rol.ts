/**
 * Quién está mirando el sitio.
 *
 * PRIVACIDAD (doc 09 §1): esto NO guarda nombre ni correo. Nunca los pidió.
 * Lo único que se conserva es cuál de tres botones se pulsó, y se queda en
 * el navegador de la persona. Del servidor lo único que sabrá algún día es
 * un contador anónimo por mes (Sección 14): `INCR stats:2026-09:estudiante`.
 * No hay nada aquí que pueda señalar a un estudiante concreto, porque no se
 * recoge nada con lo que señalarlo.
 */

export type Rol = 'estudiante' | 'encargado' | 'invitado';

export const ROLES: { id: Rol; etiqueta: string; corta: string }[] = [
  { id: 'estudiante', etiqueta: 'Soy estudiante', corta: 'Estudiante' },
  {
    id: 'encargado',
    etiqueta: 'Soy madre, padre o encargado',
    // "Encargado" es la palabra que se usa en Puerto Rico. "Padre" deja
    // fuera a las abuelas y tías que crían, que son muchas.
    corta: 'Encargado',
  },
  { id: 'invitado', etiqueta: 'Continuar como invitado', corta: 'Invitado' },
];

const CLAVE = 'consejeria:rol';
const DIAS = 30;

type Guardado = { rol: Rol; vence: number };

export function leerRol(): Rol | null {
  if (typeof window === 'undefined') return null;
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const dato = JSON.parse(crudo) as Guardado;
    if (Date.now() > dato.vence) {
      window.localStorage.removeItem(CLAVE);
      return null;
    }
    return ROLES.some((r) => r.id === dato.rol) ? dato.rol : null;
  } catch {
    // Modo privado, almacenamiento lleno, o JSON corrupto. Que falle
    // en silencio: el sitio funciona igual sin recordar nada.
    return null;
  }
}

export function guardarRol(rol: Rol): void {
  try {
    const dato: Guardado = {
      rol,
      vence: Date.now() + DIAS * 24 * 60 * 60 * 1000,
    };
    window.localStorage.setItem(CLAVE, JSON.stringify(dato));
  } catch {
    /* sin almacenamiento, seguimos igual */
  }
  emitir();
}

export function olvidarRol(): void {
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    /* nada que hacer */
  }
  emitir();
}

// ── Almacén externo para useSyncExternalStore ──────────────────────────────
//
// localStorage ES un almacén externo a React, así que se conecta con la API
// que React tiene para eso en vez de copiarlo a un useState desde un efecto.
// Leerlo en un efecto y llamar a setState provoca un render en cascada, y
// las reglas del compilador de React 19 lo rechazan con razón.
//
// Regalo de esta forma de hacerlo: el evento `storage` avisa cuando OTRA
// pestaña cambia el rol, así que todas las pestañas abiertas se mantienen
// de acuerdo solas.

const oyentes = new Set<() => void>();

function emitir(): void {
  for (const avisar of oyentes) avisar();
}

export function suscribirRol(avisar: () => void): () => void {
  oyentes.add(avisar);
  window.addEventListener('storage', avisar);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener('storage', avisar);
  };
}

/** Devuelve un primitivo (string o null), así que React puede compararlo
 *  por valor sin riesgo de bucle infinito. */
export function instantaneaRol(): Rol | null {
  return leerRol();
}

/** En el servidor no hay localStorage. Devolver siempre null hace que el
 *  HTML del servidor y el del primer render del cliente coincidan. */
export function instantaneaServidor(): Rol | null {
  return null;
}

/**
 * La "lente" (doc 06 §1): el mismo contenido, ordenado y descrito según
 * quién mira. Es lo que hace que preguntar valga la pena — si la respuesta
 * no cambiara nada, la pregunta sobraría.
 */
export type ClaveSeccion = 'guias' | 'noticias' | 'consejered';

export const ORDEN_SECCIONES: Record<Rol, ClaveSeccion[]> = {
  // Un estudiante llega con una pregunta concreta.
  estudiante: ['guias', 'noticias', 'consejered'],
  // Un encargado llega a ver qué pasa en la escuela.
  encargado: ['noticias', 'guias', 'consejered'],
  invitado: ['guias', 'noticias', 'consejered'],
};

/**
 * Cuenta la visita una sola vez por navegador y por mes.
 *
 * Sin esta marca, alguien que entra cinco veces en un día contaría cinco
 * veces y el número dejaría de significar "cuánta gente nos visita". La
 * marca vive en el navegador de la persona y no viaja a ningún sitio.
 */
export function contarVisitaUnaVez(rol: Rol): void {
  const mes = new Date().toISOString().slice(0, 7);
  const clave = `consejeria:contado:${mes}`;
  try {
    if (window.localStorage.getItem(clave)) return;
    window.localStorage.setItem(clave, '1');
  } catch {
    // Sin almacenamiento no se puede evitar el recuento doble. Se cuenta
    // igual: es mejor un número algo alto que ningún número.
  }
  void fetch('/api/visita', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rol }),
    keepalive: true,
  }).catch(() => {});
}
