import 'server-only';
import type { FuenteContenido } from './tipos';
import { archivosLocal, fuenteLocal } from './local';
import { archivosGitHub, fuenteGitHub } from './github';

export type { FuenteArchivos, FuenteContenido, NombreArchivo } from './tipos';

/**
 * Elige la fuente según el entorno.
 *
 * Con CONSEJERIA_GITHUB_TOKEN y CONSEJERIA_GITHUB_REPO puestos, se usa
 * GitHub. Sin ellos, el disco.
 *
 * POR QUÉ EL PREFIJO `CONSEJERIA_`: en Vercel las variables compartidas del
 * equipo son de todos los proyectos, y `GITHUB_TOKEN` es un nombre que ya
 * suele estar cogido — GitHub Actions lo inyecta solo, y cualquier otro
 * proyecto del mismo equipo lo reclama. Con un nombre propio no hay choque
 * posible y, más importante, no hay forma de heredar por accidente el token
 * de otro proyecto y escribir en el repositorio equivocado.
 * Así el proyecto arranca y el panel funciona sin configurar nada, y pasar a
 * producción es rellenar dos variables.
 *
 * `import 'server-only'` hace que el build FALLE si algún componente de
 * cliente importa esto por error. Sin esa línea, un import descuidado
 * mandaría el token de GitHub al navegador y nadie se enteraría.
 */
function usaGitHub(): boolean {
  return Boolean(
    process.env.CONSEJERIA_GITHUB_TOKEN && process.env.CONSEJERIA_GITHUB_REPO,
  );
}

export const fuente: FuenteContenido = usaGitHub() ? fuenteGitHub : fuenteLocal;

export const archivos = usaGitHub() ? archivosGitHub : archivosLocal;
