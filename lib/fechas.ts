/**
 * Fechas en español de Puerto Rico.
 *
 * Se formatean SIEMPRE en el servidor y se pasan ya como texto a los
 * componentes. Si se formatearan en el cliente, la zona horaria del navegador
 * podría dar un día distinto al del servidor y React se quejaría de que el
 * HTML no coincide — un fallo molesto de encontrar porque solo aparece para
 * quien esté en la zona horaria equivocada a la hora equivocada.
 */

const ZONA = 'America/Puerto_Rico';

export function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-PR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA,
  }).format(new Date(iso));
}

export function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es-PR', {
    day: 'numeric',
    month: 'short',
    timeZone: ZONA,
  }).format(new Date(iso));
}

export function mesYAno(iso: string): string {
  return new Intl.DateTimeFormat('es-PR', {
    month: 'long',
    year: 'numeric',
    timeZone: ZONA,
  }).format(new Date(iso));
}
