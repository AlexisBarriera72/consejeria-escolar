'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { exigirPanel } from '@/lib/guardia';
import { crudo, guardarNoticias } from '@/lib/contenido';
import { archivos } from '@/lib/fuente';
import { puedePublicar, revisar } from '@/lib/semaforo';
import type { Anuncio, PlantillaId } from '@/lib/tipos';

const PLANTILLAS = [
  'periodico',
  'blog',
  'notita',
  'corcho',
  'comunicado',
  'afiche',
  'pizarra',
  'urgente',
] as const;

const Entrada = z.object({
  id: z.string().min(1),
  plantilla: z.enum(PLANTILLAS),
  titulo: z.string().trim().min(1).max(200),
  bajada: z.string().trim().max(300).nullable(),
  cuerpo: z.string().max(50_000),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .max(120),
  etiquetas: z.array(z.string().trim().max(40)).max(6),
  fechaEvento: z.string().nullable(),
  horaTexto: z.string().trim().max(80).nullable(),
  lugar: z.string().trim().max(120).nullable(),
  autorPerfilId: z.string().nullable(),
  destacado: z.boolean(),
  publicarEn: z.string(),
  expiraEn: z.string().nullable(),
  imagenUrl: z.string().nullable(),
  imagenAlt: z.string().trim().max(300).nullable(),
  publicar: z.boolean(),
});

export type Resultado = { ok: true } | { ok: false; error: string };

export async function guardarNoticia(
  entrada: z.input<typeof Entrada>,
): Promise<Resultado> {
  const sesion = await exigirPanel();
  const datos = Entrada.safeParse(entrada);
  if (!datos.success) {
    return {
      ok: false,
      error: datos.error.issues[0]?.message ?? 'Revisa los datos.',
    };
  }
  const d = datos.data;

  if (d.publicar) {
    const hallazgos = revisar({
      titulo: d.titulo,
      cuerpoHtml: d.cuerpo,
      tieneImagen: Boolean(d.imagenUrl),
      imagenAlt: d.imagenAlt,
    });
    if (!puedePublicar(hallazgos)) {
      return {
        ok: false,
        error: hallazgos.find((h) => h.nivel === 'rojo')?.mensaje ?? '',
      };
    }
  }

  // Una fecha de retirada anterior a la de publicación haría que el anuncio
  // no llegara a verse nunca.
  if (d.expiraEn && new Date(d.expiraEn) <= new Date(d.publicarEn)) {
    return {
      ok: false,
      error:
        'La fecha para retirarlo tiene que ser posterior a la de publicación.',
    };
  }

  const todas = await crudo.noticias();
  if (todas.some((a) => a.slug === d.slug && a.id !== d.id)) {
    return { ok: false, error: 'Ya hay otro anuncio con esa dirección.' };
  }

  const ahora = new Date().toISOString();
  const existente = todas.find((a) => a.id === d.id);

  const guardado: Anuncio = {
    id: d.id,
    estado: d.publicar ? 'publicado' : 'borrador',
    locale: 'es',
    creadoEn: existente?.creadoEn ?? ahora,
    actualizadoEn: ahora,
    actualizadoPor: sesion.usuario,
    eliminadoEn: existente?.eliminadoEn ?? null,
    slug: d.slug,
    plantilla: d.plantilla as PlantillaId,
    titulo: d.titulo,
    bajada: d.bajada || null,
    cuerpo: d.cuerpo,
    imagen: d.imagenUrl
      ? {
          url: d.imagenUrl,
          alt: d.imagenAlt ?? '',
          ancho: 1600,
          alto: 900,
          focoX: 0.5,
          focoY: 0.5,
        }
      : null,
    etiquetas: d.etiquetas,
    fechaEvento: d.fechaEvento,
    horaTexto: d.horaTexto || null,
    lugar: d.lugar || null,
    autorPerfilId: d.autorPerfilId,
    destacado: d.destacado,
    publicarEn: d.publicarEn,
    expiraEn: d.expiraEn,
  };

  // Solo puede haber un destacado: si este lo es, los demás dejan de serlo.
  const siguiente = (
    existente
      ? todas.map((a) => (a.id === d.id ? guardado : a))
      : [...todas, guardado]
  ).map((a) => (d.destacado && a.id !== d.id ? { ...a, destacado: false } : a));

  await guardarNoticias(
    siguiente,
    `${sesion.usuario} ${existente ? 'actualizó' : 'creó'} el anuncio "${d.titulo}"`,
  );
  revalidatePath('/noticias');
  revalidatePath('/edit/panel/noticias');
  return { ok: true };
}

export async function borrarNoticia(id: string): Promise<{ ok: boolean }> {
  const sesion = await exigirPanel();
  const todas = await crudo.noticias();
  await guardarNoticias(
    todas.map((a) =>
      a.id === id ? { ...a, eliminadoEn: new Date().toISOString() } : a,
    ),
    `${sesion.usuario} envió un anuncio a la papelera`,
  );
  revalidatePath('/noticias');
  revalidatePath('/edit/panel/noticias');
  return { ok: true };
}

/**
 * Recibe una foto YA comprimida por el navegador (doc 04 §7).
 *
 * La compresión ocurre en el cliente a propósito: si aceptáramos el archivo
 * original, una foto de teléfono de 8 MB viajaría entera por los datos
 * móviles de la maestra antes de que el servidor pudiera hacer nada.
 * Comprimir primero convierte esos 8 MB en unos 300 KB.
 */
export async function subirFoto(
  datos: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const sesion = await exigirPanel();
  const archivo = datos.get('foto');
  if (!(archivo instanceof File)) {
    return { ok: false, error: 'No llegó ninguna foto.' };
  }
  if (archivo.size > 2 * 1024 * 1024) {
    return { ok: false, error: 'La foto pesa demasiado, incluso comprimida.' };
  }
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  const nombre = `${randomUUID()}.webp`;
  const url = await archivos.subir(
    nombre,
    bytes,
    `${sesion.usuario} subió una foto`,
  );
  return { ok: true, url };
}
