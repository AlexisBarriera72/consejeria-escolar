/**
 * Modo Calma (doc 06 §5).
 *
 * Baja el volumen visual del sitio: apaga la saturación de los acentos,
 * quita todo el movimiento, abre el interlineado y engorda un poco el texto.
 *
 * Esto es un sitio de CONSEJERÍA. Parte de quien llega aquí lo hace ansioso,
 * sobreestimulado o con la cabeza en otra cosa, y una pared de rosa fuerte y
 * turquesa es hostil para esa persona en ese momento. Ofrecer una versión
 * tranquila es una cortesía barata, y en este contexto además es coherente
 * con lo que el sitio dice ser.
 *
 * Cuesta un bloque de CSS porque toda la paleta ya está en tokens.
 */

export const CLAVE_CALMA = 'consejeria:calma';

const oyentes = new Set<() => void>();

function aplicar(activo: boolean): void {
  document.documentElement.dataset.modo = activo ? 'calma' : '';
}

export function suscribirCalma(avisar: () => void): () => void {
  oyentes.add(avisar);
  window.addEventListener('storage', avisar);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener('storage', avisar);
  };
}

export function calmaActiva(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_CALMA) === '1';
  } catch {
    return false;
  }
}

export function calmaServidor(): boolean {
  return false;
}

export function alternarCalma(): void {
  const nuevo = !calmaActiva();
  try {
    window.localStorage.setItem(CLAVE_CALMA, nuevo ? '1' : '0');
  } catch {
    /* sin almacenamiento: vale para esta sesión y ya */
  }
  aplicar(nuevo);
  for (const avisar of oyentes) avisar();
}

/**
 * Se inyecta en el <head> y corre ANTES de pintar.
 *
 * Sin esto, quien tiene el modo activado ve medio segundo de colores fuertes
 * en cada carga antes de que React hidrate — justo el destello que el modo
 * existe para evitar.
 */
export const GUION_CALMA = `try{if(localStorage.getItem('${CLAVE_CALMA}')==='1'){document.documentElement.dataset.modo='calma'}}catch(e){}`;
