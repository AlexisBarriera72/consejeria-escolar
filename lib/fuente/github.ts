import { revalidateTag } from 'next/cache';
import type { FuenteArchivos, FuenteContenido, NombreArchivo } from './tipos';

/**
 * El repositorio de GitHub como base de datos (doc 09 §2).
 *
 * Lectura: la API de Contents, con caché etiquetada por archivo.
 * Escritura: un commit por guardado.
 *
 * Lo bueno de esto, que no es poco:
 *  · No hay base de datos que se pause, caduque o haya que mantener.
 *  · `git log` ES el historial de versiones. La función "restaurar" de la
 *    Sección 12 sale gratis.
 *  · Si algún día Vercel desaparece, el contenido sigue estando entero en
 *    un repositorio de git. Nada se pierde.
 *
 * El publicar NO espera a que Vercel reconstruya el sitio: se escribe el
 * archivo y se invalida la etiqueta de caché, así que el cambio se ve en
 * dos o tres segundos. Sin esto habría que esperar un despliegue completo, y
 * cuarenta segundos de espera sin explicación se leen como "está roto".
 */

const API = 'https://api.github.com';

function config() {
  // Los nombres llevan prefijo del proyecto a propósito — ver la nota en
  // lib/fuente/index.ts. Y NO hay respaldo a `GITHUB_TOKEN` a secas: si otro
  // proyecto comparte una variable con ese nombre, heredarla en silencio
  // significaría escribir el contenido de la consejería en el repositorio
  // equivocado. Mejor fallar y decirlo.
  const token = process.env.CONSEJERIA_GITHUB_TOKEN;
  const repo = process.env.CONSEJERIA_GITHUB_REPO;
  const rama = process.env.CONSEJERIA_GITHUB_BRANCH ?? 'main';
  if (!token || !repo) {
    throw new Error(
      'Faltan CONSEJERIA_GITHUB_TOKEN o CONSEJERIA_GITHUB_REPO. ' +
        'Revisa .env.example.',
    );
  }
  return { token, repo, rama };
}

const ruta = (archivo: NombreArchivo) => `contenido/${archivo}.json`;

async function pedir(url: string, token: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
}

/** El sha del archivo, que GitHub exige para sobrescribirlo.
 *
 *  Es un bloqueo optimista: si alguien más guardó entre que leímos y que
 *  escribimos, el sha ya no cuadra y GitHub rechaza el cambio en vez de
 *  pisar lo del otro en silencio. */
async function shaActual(archivo: NombreArchivo): Promise<string | undefined> {
  const { token, repo, rama } = config();
  const res = await pedir(
    `${API}/repos/${repo}/contents/${ruta(archivo)}?ref=${rama}`,
    token,
    { cache: 'no-store' },
  );
  if (res.status === 404) return undefined; // aún no existe
  if (!res.ok) throw new Error(`GitHub ${res.status} al leer el sha`);
  const cuerpo = (await res.json()) as { sha: string };
  return cuerpo.sha;
}

export const fuenteGitHub: FuenteContenido = {
  nombre: 'github (contenido/*.json)',

  async leer<T>(archivo: NombreArchivo): Promise<T> {
    const { token, repo, rama } = config();
    const res = await pedir(
      `${API}/repos/${repo}/contents/${ruta(archivo)}?ref=${rama}`,
      token,
      {
        // La etiqueta permite invalidar SOLO este archivo al guardarlo,
        // en vez de tirar la caché entera del sitio.
        next: { tags: [`contenido:${archivo}`], revalidate: 300 },
      },
    );
    if (!res.ok) throw new Error(`GitHub ${res.status} al leer ${archivo}`);
    const cuerpo = (await res.json()) as { content: string };
    const texto = Buffer.from(cuerpo.content, 'base64').toString('utf8');
    return JSON.parse(texto) as T;
  },

  async escribir<T>(
    archivo: NombreArchivo,
    datos: T,
    mensaje: string,
  ): Promise<void> {
    const { token, repo, rama } = config();
    const sha = await shaActual(archivo);

    const res = await pedir(
      `${API}/repos/${repo}/contents/${ruta(archivo)}`,
      token,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: mensaje,
          content: Buffer.from(
            JSON.stringify(datos, null, 2) + '\n',
            'utf8',
          ).toString('base64'),
          branch: rama,
          sha,
        }),
      },
    );

    if (res.status === 409) {
      throw new Error(
        'Alguien más guardó este contenido hace un momento. ' +
          'Recarga la página para no perder su cambio.',
      );
    }
    if (!res.ok) {
      throw new Error(`GitHub ${res.status} al guardar ${archivo}`);
    }

    // `{ expire: 0 }` a propósito, en contra de la recomendación de Next.
    //
    // El valor recomendado, "max", sirve contenido viejo durante un año
    // mientras revalida por detrás. Para un blog eso está bien. Aquí no:
    // la maestra pulsa "Publicar", entra a la página pública a comprobar, y
    // vería la versión ANTERIOR. Eso se lee como "no funcionó", y lo que
    // hace a continuación es volver a pulsar Publicar.
    //
    // Con expire 0 la siguiente petición espera a que se revalide. Cuesta
    // unas décimas de segundo en una petición. A cambio, lo que se ve es
    // siempre lo que se acaba de guardar — y cuando lo publicado es "mañana
    // no hay clases", que sea correcto importa más que que sea rápido.
    revalidateTag(`contenido:${archivo}`, { expire: 0 });
  },
};

/**
 * Subir una foto = un commit con el binario.
 *
 * Las fotos van en el repositorio junto al contenido. Ya vienen comprimidas
 * a WebP por el navegador (doc 04 §7), así que pesan cientos de KB y no
 * megas: un repositorio de git aguanta eso sin despeinarse durante años.
 */
export const archivosGitHub: FuenteArchivos = {
  async subir(ruta, bytes, mensaje) {
    const { token, repo, rama } = config();
    const destino = `public/subidas/${ruta}`;
    const res = await pedir(`${API}/repos/${repo}/contents/${destino}`, token, {
      method: 'PUT',
      body: JSON.stringify({
        message: mensaje,
        content: Buffer.from(bytes).toString('base64'),
        branch: rama,
      }),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status} al subir la foto`);
    return `/subidas/${ruta}`;
  },
};
