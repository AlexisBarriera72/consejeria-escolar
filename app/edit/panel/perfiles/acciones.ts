'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { exigirPanel } from '@/lib/guardia';
import { crudo, guardarPerfiles } from '@/lib/contenido';
import type { Perfil } from '@/lib/tipos';

const ACENTOS = [
  'azul',
  'turquesa',
  'menta',
  'rosa',
  'coral',
  'naranja',
  'ambar',
  'salvia',
] as const;

const Entrada = z.object({
  id: z.string().min(1),
  nombre: z.string().trim().min(1).max(120),
  puesto: z.string().trim().min(1).max(120),
  escuela: z.string().trim().max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .max(120),
  acento: z.enum(ACENTOS),
  estadoDelDia: z.string().trim().max(120).nullable(),
  frase: z.string().trim().max(300).nullable(),
  bio: z.string().max(20_000),
  credenciales: z
    .array(
      z.object({
        titulo: z.string().trim().max(160),
        institucion: z.string().trim().max(160),
        anio: z.number().int().min(1900).max(2100).nullable(),
      }),
    )
    .max(12),
  trabajaEn: z.array(z.string().trim().max(80)).max(12),
  trabajaCon: z.array(z.string()).max(30),
  contacto: z.object({
    email: z.string().trim().max(200).nullable(),
    extension: z.string().trim().max(20).nullable(),
    oficina: z.string().trim().max(200).nullable(),
    horario: z.string().trim().max(200).nullable(),
  }),
  publicar: z.boolean(),
});

export type Resultado = { ok: true } | { ok: false; error: string };

export async function guardarPerfil(
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

  const todos = await crudo.perfiles();
  if (todos.some((p) => p.slug === d.slug && p.id !== d.id)) {
    return { ok: false, error: 'Ya hay otro perfil con esa dirección.' };
  }

  const ahora = new Date().toISOString();
  const existente = todos.find((p) => p.id === d.id);

  const guardado: Perfil = {
    id: d.id,
    estado: d.publicar ? 'publicado' : 'borrador',
    locale: 'es',
    creadoEn: existente?.creadoEn ?? ahora,
    actualizadoEn: ahora,
    actualizadoPor: sesion.usuario,
    eliminadoEn: existente?.eliminadoEn ?? null,
    slug: d.slug,
    nombre: d.nombre,
    puesto: d.puesto,
    escuela: d.escuela,
    foto: existente?.foto ?? null,
    acento: d.acento,
    estadoDelDia: d.estadoDelDia || null,
    frase: d.frase || null,
    bio: d.bio,
    credenciales: d.credenciales,
    trabajaEn: d.trabajaEn,
    trabajaCon: d.trabajaCon,
    contacto: d.contacto,
    orden: existente?.orden ?? todos.length + 1,
  };

  await guardarPerfiles(
    existente
      ? todos.map((p) => (p.id === d.id ? guardado : p))
      : [...todos, guardado],
    `${sesion.usuario} ${existente ? 'actualizó' : 'creó'} el perfil de ${d.nombre}`,
  );

  revalidatePath('/consejered');
  revalidatePath('/edit/panel/perfiles');
  return { ok: true };
}

export async function borrarPerfil(id: string): Promise<{ ok: boolean }> {
  const sesion = await exigirPanel();
  const todos = await crudo.perfiles();
  await guardarPerfiles(
    todos.map((p) =>
      p.id === id ? { ...p, eliminadoEn: new Date().toISOString() } : p,
    ),
    `${sesion.usuario} envió un perfil a la papelera`,
  );
  revalidatePath('/consejered');
  revalidatePath('/edit/panel/perfiles');
  return { ok: true };
}
