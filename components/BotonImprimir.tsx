'use client';

/**
 * Imprimir esta guía.
 *
 * No es un adorno. Una parte real de los encargados no va a leer esto en una
 * pantalla: lo va a recibir impreso en la mochila de un estudiante. Las guías
 * de requisitos, becas y graduación se fotocopian y se reparten. Que la
 * versión en papel salga bien es parte del trabajo, no un extra.
 */
export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-borde hover:border-azul-500 not-print rounded-full border px-4 py-1.5 text-sm"
    >
      <span aria-hidden>🖨</span> Imprimir esta guía
    </button>
  );
}
