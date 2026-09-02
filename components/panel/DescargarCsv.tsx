'use client';

/**
 * Descarga la tabla como CSV.
 *
 * Se pidió "estadísticas en una hoja de cálculo cada mes", así que el
 * formato correcto es el que Excel y Google Sheets abren de un doble clic,
 * no una captura de pantalla de una tabla.
 *
 * Se genera en el navegador desde el texto que ya está en la página: no hace
 * falta una ruta de servidor para esto.
 */
export function DescargarCsv({ csv }: { csv: string }) {
  function descargar() {
    // El BOM hace que Excel abra el archivo en UTF-8 y no destroce las
    // tildes. Sin él, "Información" sale como "InformaciÃ³n".
    const blob = new Blob(['﻿' + csv], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitas-consejeria-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={descargar}
      className="border-azul-700 text-azul-700 hover:bg-azul-100 rounded-xl border-2 px-5 py-2.5 font-semibold"
    >
      Descargar para Excel (.csv)
    </button>
  );
}
