import type { Anuncio, Aviso, Categoria, Perfil, Pregunta } from './tipos';
import { conRelacionesMutuas } from './mutuos';

import categoriasJson from '@/contenido/categorias.json';
import preguntasJson from '@/contenido/preguntas.json';
import noticiasJson from '@/contenido/noticias.json';
import perfilesJson from '@/contenido/perfiles.json';
import avisoJson from '@/contenido/aviso.json';

/**
 * Capa de lectura de contenido.
 *
 * Hoy lee JSON del repositorio. En la Sección 11 pasa a leer de la API de
 * GitHub, y ninguna página tiene que cambiar: por eso TODAS estas funciones
 * son `async` aunque ahora mismo no esperen nada. Si fueran síncronas, el
 * cambio de la Sección 11 obligaría a tocar cada componente que las llama.
 *
 * Ninguna página debe importar los JSON directamente. Este archivo es la
 * única puerta al contenido.
 */

const categorias = categoriasJson as Categoria[];
const preguntas = preguntasJson as Pregunta[];
const noticias = noticiasJson as Anuncio[];
const perfiles = perfilesJson as Perfil[];

/** Lo que el público puede ver: publicado y no borrado. */
function esVisible<T extends { estado: string; eliminadoEn: string | null }>(
  x: T,
): boolean {
  return x.estado === 'publicado' && x.eliminadoEn === null;
}

function porOrden<T extends { orden: number }>(a: T, b: T): number {
  return a.orden - b.orden;
}

// ── Guías ──────────────────────────────────────────────────────────────────

export async function obtenerCategorias(): Promise<Categoria[]> {
  return categorias.filter(esVisible).sort(porOrden);
}

export async function obtenerPreguntas(
  categoriaId?: string,
): Promise<Pregunta[]> {
  return preguntas
    .filter(esVisible)
    .filter((p) => !categoriaId || p.categoriaId === categoriaId)
    .sort(porOrden);
}

export async function obtenerPregunta(slug: string): Promise<Pregunta | null> {
  return preguntas.filter(esVisible).find((p) => p.slug === slug) ?? null;
}

/** Categorías con sus preguntas ya agrupadas — lo que la página necesita. */
export async function obtenerGuias(): Promise<
  { categoria: Categoria; preguntas: Pregunta[] }[]
> {
  const cats = await obtenerCategorias();
  const todas = await obtenerPreguntas();
  return cats.map((categoria) => ({
    categoria,
    preguntas: todas.filter((p) => p.categoriaId === categoria.id),
  }));
}

// ── Noticias ───────────────────────────────────────────────────────────────

function estaVigente(a: Anuncio, ahora: Date): boolean {
  if (new Date(a.publicarEn) > ahora) return false; // programado a futuro
  if (a.expiraEn && new Date(a.expiraEn) < ahora) return false; // ya venció
  return true;
}

/**
 * @param incluirVencidas para el archivo ("Ediciones anteriores"), donde sí
 *   se quieren ver los anuncios viejos.
 */
export async function obtenerNoticias({
  incluirVencidas = false,
} = {}): Promise<Anuncio[]> {
  const ahora = new Date();
  return noticias
    .filter(esVisible)
    .filter((a) => incluirVencidas || estaVigente(a, ahora))
    .sort(
      (a, b) =>
        new Date(b.publicarEn).getTime() - new Date(a.publicarEn).getTime(),
    );
}

export async function obtenerNoticia(slug: string): Promise<Anuncio | null> {
  return noticias.filter(esVisible).find((a) => a.slug === slug) ?? null;
}

/** La destacada, o la más reciente si nadie fijó ninguna. */
export async function obtenerDestacada(): Promise<Anuncio | null> {
  const vigentes = await obtenerNoticias();
  return vigentes.find((a) => a.destacado) ?? vigentes[0] ?? null;
}

export async function obtenerAviso(): Promise<Aviso> {
  return avisoJson as Aviso;
}

// ── Perfiles (ConsejeRed) ──────────────────────────────────────────────────

export async function obtenerPerfiles(): Promise<Perfil[]> {
  return conRelacionesMutuas(perfiles.filter(esVisible)).sort(porOrden);
}

export async function obtenerPerfil(slug: string): Promise<Perfil | null> {
  const todos = await obtenerPerfiles();
  return todos.find((p) => p.slug === slug) ?? null;
}

/** Resuelve IDs a perfiles, para los chips de "Pregúntale a:" y
 *  "Trabaja con". Los IDs que ya no existen se descartan en silencio. */
export async function obtenerPerfilesPorId(ids: string[]): Promise<Perfil[]> {
  const todos = await obtenerPerfiles();
  return ids
    .map((id) => todos.find((p) => p.id === id))
    .filter((p): p is Perfil => p !== undefined);
}
