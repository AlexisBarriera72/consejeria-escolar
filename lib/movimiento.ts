/**
 * `prefers-reduced-motion` como almacén externo.
 *
 * No es una constante: alguien puede activar "reducir movimiento" en el
 * sistema con la página ya abierta, y la página debe obedecer en el momento,
 * sin recargar. Por eso se suscribe al `change` de la media query en vez de
 * leerla una sola vez.
 *
 * Esto no es un adorno de accesibilidad. Para algunas personas el texto y las
 * imágenes en movimiento producen mareo y náusea reales.
 */

const CONSULTA = '(prefers-reduced-motion: reduce)';

export function suscribirMovimiento(avisar: () => void): () => void {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}

export function prefiereMenosMovimiento(): boolean {
  return window.matchMedia(CONSULTA).matches;
}

/**
 * En el servidor no se puede saber la preferencia. Se asume que SÍ quiere
 * menos movimiento: si acertamos, perfecto; si no, lo peor que pasa es que
 * la animación no arranca hasta hidratar. Al revés — asumir que todo el
 * mundo quiere animación — se le mueve la pantalla a quien pidió que no.
 */
export function prefiereMenosMovimientoServidor(): boolean {
  return true;
}
