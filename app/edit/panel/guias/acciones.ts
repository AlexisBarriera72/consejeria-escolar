'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { exigirPanel } from '@/lib/guardia';
import { crudo, guardarPreguntas } from '@/lib/contenido';
import { revisar, puedePublicar } from '@/lib/semaforo';
import type { Pregunta } from '@/lib/tipos';

/**
 * Acciones de las guías.
 *
 * Todas empiezan por `exigirPanel()`. Una acción de servidor es un punto de
 * entrada HTTP como cualquier otro: se puede llamar directamente, sin pasar
 * por la pantalla. Que la pantalla esté protegida no protege la acción.
 */

const Entrada = z.object({
  id: z.string().min(1),
  categoriaId: z.string().min(1),
  pregunta: z.string().trim().min(1).max(200),
  respuesta: z.string().max(50_000),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .max(120),
  responsables: z.array(z.string()).max(10),
  publicar: z.boolean(),
});

export type ResultadoGuardado =
  { ok: true; id: string } | { ok: false; error: string };

export async function guardarGuia(
  entrada: z.input<typeof Entrada>,
): Promise<ResultadoGuardado> {
  const sesion = await exigirPanel();

  const datos = Entrada.safeParse(entrada);
  if (!datos.success) {
    return {
      ok: false,
      error: datos.error.issues[0]?.message ?? 'Revisa los datos.',
    };
  }
  const d = datos.data;

  // El semáforo se vuelve a evaluar AQUÍ, no solo en el navegador. La
  // comprobación del cliente es comodidad; esta es la que manda.
  if (d.publicar) {
    const hallazgos = revisar({
      titulo: d.pregunta,
      cuerpoHtml: d.respuesta,
    });
    if (!puedePublicar(hallazgos)) {
      return {
        ok: false,
        error: hallazgos.find((h) => h.nivel === 'rojo')?.mensaje ?? '',
      };
    }
  }

  const todas = await crudo.preguntas();

  // Un slug repetido haría que dos guías se pelearan por la misma dirección
  // y una de las dos quedara inalcanzable.
  if (todas.some((p) => p.slug === d.slug && p.id !== d.id)) {
    return { ok: false, error: 'Ya hay otra guía con esa dirección.' };
  }

  const ahora = new Date().toISOString();
  const existente = todas.find((p) => p.id === d.id);

  const actualizada: Pregunta = existente
    ? {
        ...existente,
        categoriaId: d.categoriaId,
        pregunta: d.pregunta,
        respuesta: d.respuesta,
        slug: d.slug,
        responsables: d.responsables,
        estado: d.publicar ? 'publicado' : 'borrador',
        actualizadoEn: ahora,
        actualizadoPor: sesion.usuario,
      }
    : {
        id: d.id,
        estado: d.publicar ? 'publicado' : 'borrador',
        locale: 'es',
        creadoEn: ahora,
        actualizadoEn: ahora,
        actualizadoPor: sesion.usuario,
        eliminadoEn: null,
        categoriaId: d.categoriaId,
        slug: d.slug,
        pregunta: d.pregunta,
        respuesta: d.respuesta,
        video: null,
        adjuntos: [],
        responsables: d.responsables,
        orden: todas.length + 1,
      };

  const siguiente = existente
    ? todas.map((p) => (p.id === d.id ? actualizada : p))
    : [...todas, actualizada];

  await guardarPreguntas(
    siguiente,
    `${sesion.usuario} ${existente ? 'actualizó' : 'creó'} la guía "${d.pregunta}"`,
  );

  revalidatePath('/guias');
  revalidatePath('/edit/panel/guias');
  return { ok: true, id: d.id };
}

/**
 * Borrar es mover a la papelera, no destruir.
 *
 * Quien no es técnico borra cosas sin querer, y el pánico de haber perdido
 * algo es lo que hace que alguien no vuelva a abrir el panel. Treinta días
 * de red de seguridad convierten una acción que da miedo en una reversible.
 */
export async function borrarGuia(id: string): Promise<{ ok: boolean }> {
  const sesion = await exigirPanel();
  const todas = await crudo.preguntas();
  const ahora = new Date().toISOString();

  await guardarPreguntas(
    todas.map((p) =>
      p.id === id
        ? { ...p, eliminadoEn: ahora, actualizadoPor: sesion.usuario }
        : p,
    ),
    `${sesion.usuario} envió una guía a la papelera`,
  );
  revalidatePath('/guias');
  revalidatePath('/edit/panel/guias');
  return { ok: true };
}

export async function restaurarGuia(id: string): Promise<{ ok: boolean }> {
  const sesion = await exigirPanel();
  const todas = await crudo.preguntas();
  await guardarPreguntas(
    todas.map((p) => (p.id === id ? { ...p, eliminadoEn: null } : p)),
    `${sesion.usuario} recuperó una guía de la papelera`,
  );
  revalidatePath('/guias');
  revalidatePath('/edit/panel/papelera');
  return { ok: true };
}

export async function nuevoId(): Promise<string> {
  await exigirPanel();
  return randomUUID();
}
