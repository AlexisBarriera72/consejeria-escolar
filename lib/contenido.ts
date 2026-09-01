import 'server-only';
import { cache } from 'react';
import type { Anuncio, Aviso, Categoria, Perfil, Pregunta } from './tipos';
import { conRelacionesMutuas } from './mutuos';
import { fuente } from './fuente';

/**
 * La única puerta al contenido.
 *
 * Ninguna página lee los JSON por su cuenta. Todo pasa por aquí, y por eso
 * cambiar de "archivos en disco" a "API de GitHub" en la Sección 11 no obligó
 * a tocar ni un componente: las funciones ya eran `async` desde la Sección 3
 * precisamente para que este día no doliera.
 *
 * `cache()` de React memoriza cada lectura DENTRO de un mismo render. Sin
 * esto, una página de guías que resuelve responsables pregunta por pregunta
 * releería la lista de perfiles doce veces.
 */

const leerCategorias = cache(() => fuente.leer<Categoria[]>('categorias'));
const leerPreguntas = cache(() => fuente.leer<Pregunta[]>('preguntas'));
const leerNoticias = cache(() => fuente.leer<Anuncio[]>('noticias'));
const leerPerfiles = cache(() => fuente.leer<Perfil[]>('perfiles'));
const leerAviso = cache(() => fuente.leer<Aviso>('aviso'));

/** Lo que el público puede ver: publicado y no borrado. */
function esVisible<T extends { estado: string; eliminadoEn: string | null }>(
  x: T,
): boolean {
  return x.estado === 'publicado' && x.eliminadoEn === null;
}

/** Lo que el panel puede ver: todo menos lo que está en la papelera. */
function noBorrado<T extends { eliminadoEn: string | null }>(x: T): boolean {
  return x.eliminadoEn === null;
}

function porOrden<T extends { orden: number }>(a: T, b: T): number {
  return a.orden - b.orden;
}

// ── Guías ──────────────────────────────────────────────────────────────────

export async function obtenerCategorias(): Promise<Categoria[]> {
  return (await leerCategorias()).filter(esVisible).sort(porOrden);
}

export async function obtenerPreguntas(
  categoriaId?: string,
): Promise<Pregunta[]> {
  return (await leerPreguntas())
    .filter(esVisible)
    .filter((p) => !categoriaId || p.categoriaId === categoriaId)
    .sort(porOrden);
}

export async function obtenerPregunta(slug: string): Promise<Pregunta | null> {
  return (
    (await leerPreguntas()).filter(esVisible).find((p) => p.slug === slug) ??
    null
  );
}

export async function obtenerGuias(): Promise<
  { categoria: Categoria; preguntas: Pregunta[] }[]
> {
  const [cats, todas] = await Promise.all([
    obtenerCategorias(),
    obtenerPreguntas(),
  ]);
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

export async function obtenerNoticias({
  incluirVencidas = false,
} = {}): Promise<Anuncio[]> {
  const ahora = new Date();
  return (await leerNoticias())
    .filter(esVisible)
    .filter((a) => incluirVencidas || estaVigente(a, ahora))
    .sort(
      (a, b) =>
        new Date(b.publicarEn).getTime() - new Date(a.publicarEn).getTime(),
    );
}

export async function obtenerNoticia(slug: string): Promise<Anuncio | null> {
  return (
    (await leerNoticias()).filter(esVisible).find((a) => a.slug === slug) ??
    null
  );
}

export async function obtenerDestacada(): Promise<Anuncio | null> {
  const vigentes = await obtenerNoticias();
  return vigentes.find((a) => a.destacado) ?? vigentes[0] ?? null;
}

export async function obtenerAviso(): Promise<Aviso> {
  return leerAviso();
}

// ── Perfiles (ConsejeRed) ──────────────────────────────────────────────────

export async function obtenerPerfiles(): Promise<Perfil[]> {
  const todos = (await leerPerfiles()).filter(esVisible);
  return conRelacionesMutuas(todos).sort(porOrden);
}

export async function obtenerPerfil(slug: string): Promise<Perfil | null> {
  return (await obtenerPerfiles()).find((p) => p.slug === slug) ?? null;
}

export async function obtenerPerfilesPorId(ids: string[]): Promise<Perfil[]> {
  const todos = await obtenerPerfiles();
  return ids
    .map((id) => todos.find((p) => p.id === id))
    .filter((p): p is Perfil => p !== undefined);
}

// ── Lecturas del panel ─────────────────────────────────────────────────────
//
// Devuelven TAMBIÉN los borradores. Solo se usan detrás del acceso del
// personal; ninguna página pública debe llamarlas.

export async function panelCategorias(): Promise<Categoria[]> {
  return (await leerCategorias()).filter(noBorrado).sort(porOrden);
}

export async function panelPreguntas(): Promise<Pregunta[]> {
  return (await leerPreguntas()).filter(noBorrado).sort(porOrden);
}

export async function panelNoticias(): Promise<Anuncio[]> {
  return (await leerNoticias())
    .filter(noBorrado)
    .sort(
      (a, b) =>
        new Date(b.publicarEn).getTime() - new Date(a.publicarEn).getTime(),
    );
}

export async function panelPerfiles(): Promise<Perfil[]> {
  return (await leerPerfiles()).filter(noBorrado).sort(porOrden);
}

/** Lo que está en la papelera, para poder recuperarlo. */
export async function panelPapelera(): Promise<{
  preguntas: Pregunta[];
  noticias: Anuncio[];
  perfiles: Perfil[];
}> {
  const [preguntas, noticias, perfiles] = await Promise.all([
    leerPreguntas(),
    leerNoticias(),
    leerPerfiles(),
  ]);
  const borrado = <T extends { eliminadoEn: string | null }>(x: T) =>
    x.eliminadoEn !== null;
  return {
    preguntas: preguntas.filter(borrado),
    noticias: noticias.filter(borrado),
    perfiles: perfiles.filter(borrado),
  };
}

// ── Escrituras ─────────────────────────────────────────────────────────────
//
// Siempre la lista COMPLETA, incluidos borradores y papelera: se sobrescribe
// el archivo entero. Guardar solo lo visible borraría todo lo demás.

export async function guardarPreguntas(datos: Pregunta[], mensaje: string) {
  await fuente.escribir('preguntas', datos, mensaje);
}
export async function guardarNoticias(datos: Anuncio[], mensaje: string) {
  await fuente.escribir('noticias', datos, mensaje);
}
export async function guardarPerfiles(datos: Perfil[], mensaje: string) {
  await fuente.escribir('perfiles', datos, mensaje);
}
export async function guardarCategorias(datos: Categoria[], mensaje: string) {
  await fuente.escribir('categorias', datos, mensaje);
}
export async function guardarAviso(datos: Aviso, mensaje: string) {
  await fuente.escribir('aviso', datos, mensaje);
}

/** Listas crudas, sin filtrar, para leer-modificar-escribir. */
export const crudo = {
  preguntas: () => leerPreguntas(),
  noticias: () => leerNoticias(),
  perfiles: () => leerPerfiles(),
  categorias: () => leerCategorias(),
  aviso: () => leerAviso(),
};

/**
 * Cuántos anuncios vencen dentro de `dias`.
 *
 * Vive aquí y no en la página del panel a propósito: `Date.now()` dentro del
 * cuerpo de un componente es una llamada impura, y las reglas del compilador
 * de React 19 la rechazan con razón — un render no debería depender de la
 * hora en que ocurre. Aquí es una función normal y no hay problema.
 */
export async function contarVencenPronto(dias = 14): Promise<number> {
  const ahora = Date.now();
  const limite = ahora + dias * 24 * 60 * 60 * 1000;
  return (await leerNoticias()).filter((a) => {
    if (!a.expiraEn || a.eliminadoEn) return false;
    const t = new Date(a.expiraEn).getTime();
    return t > ahora && t < limite;
  }).length;
}
