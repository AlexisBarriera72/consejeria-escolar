import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FuenteContenido, NombreArchivo } from './tipos';

const CARPETA = join(process.cwd(), 'contenido');

/**
 * Fuente de contenido en disco.
 *
 * Se usa en desarrollo. Escribe los mismos archivos JSON que están en el
 * repositorio, así que lo que edites en el panel local aparece como un
 * cambio de git normal y se puede revisar antes de subirlo.
 *
 * No se usa en producción: en Vercel el sistema de archivos es de solo
 * lectura y además se descarta en cada despliegue, así que un `escribir`
 * fallaría o se perdería sin avisar. De eso se encarga github.ts.
 */
export const fuenteLocal: FuenteContenido = {
  nombre: 'local (contenido/*.json)',

  async leer<T>(archivo: NombreArchivo): Promise<T> {
    const crudo = await readFile(join(CARPETA, `${archivo}.json`), 'utf8');
    return JSON.parse(crudo) as T;
  },

  async escribir<T>(archivo: NombreArchivo, datos: T): Promise<void> {
    await writeFile(
      join(CARPETA, `${archivo}.json`),
      JSON.stringify(datos, null, 2) + '\n',
      'utf8',
    );
  },
};
