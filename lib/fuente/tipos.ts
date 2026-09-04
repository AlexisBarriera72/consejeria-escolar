/**
 * De dónde sale (y a dónde va) el contenido.
 *
 * Una sola interfaz con dos implementaciones:
 *
 *   local.ts    lee y escribe contenido/*.json en el disco. Es lo que corre
 *               en desarrollo, y permite probar el panel entero sin tener
 *               ninguna credencial.
 *   github.ts   lee y escribe por la API de GitHub. Es lo que corre en
 *               producción (doc 09 §2): el repositorio ES la base de datos,
 *               no se pausa nunca, es gratis para siempre, y `git log` da
 *               el historial de versiones sin escribir una línea.
 *
 * Que sean intercambiables no es elegancia por gusto: significa que pasar de
 * una a otra es cambiar una variable de entorno, y que el panel se puede
 * construir y probar hoy, sin esperar a tener tokens.
 */

export type NombreArchivo =
  | 'categorias'
  | 'preguntas'
  | 'noticias'
  | 'perfiles'
  | 'aviso'
  | 'portada';

export interface FuenteContenido {
  /** Nombre para los mensajes de diagnóstico. */
  readonly nombre: string;

  leer<T>(archivo: NombreArchivo): Promise<T>;

  /**
   * @param mensaje queda como mensaje del commit en GitHub. Se escribe
   *   pensando en quien lo lea dentro de dos años en `git log`, no en la
   *   máquina: "Sra. Rivera actualizó el anuncio sobre becas".
   */
  escribir<T>(archivo: NombreArchivo, datos: T, mensaje: string): Promise<void>;
}

/**
 * Subida de archivos binarios (fotos).
 *
 * Va aparte de `escribir` porque el contenido es JSON y esto no: aquí llegan
 * bytes ya comprimidos por el navegador.
 */
export interface FuenteArchivos {
  subir(ruta: string, bytes: Uint8Array, mensaje: string): Promise<string>;
}
