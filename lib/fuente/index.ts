import 'server-only';
import type { FuenteContenido } from './tipos';
import { fuenteLocal } from './local';
import { fuenteGitHub } from './github';

export type { FuenteContenido, NombreArchivo } from './tipos';

/**
 * Elige la fuente según el entorno.
 *
 * Con GITHUB_TOKEN y GITHUB_REPO puestos, se usa GitHub. Sin ellos, el disco.
 * Así el proyecto arranca y el panel funciona sin configurar nada, y pasar a
 * producción es rellenar dos variables.
 *
 * `import 'server-only'` hace que el build FALLE si algún componente de
 * cliente importa esto por error. Sin esa línea, un import descuidado
 * mandaría el token de GitHub al navegador y nadie se enteraría.
 */
export const fuente: FuenteContenido =
  process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
    ? fuenteGitHub
    : fuenteLocal;
