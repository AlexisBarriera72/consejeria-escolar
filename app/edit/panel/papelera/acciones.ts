'use server';

import { revalidatePath } from 'next/cache';
import { exigirPanel } from '@/lib/guardia';
import {
  crudo,
  guardarNoticias,
  guardarPerfiles,
  guardarPreguntas,
} from '@/lib/contenido';

export type Tipo = 'pregunta' | 'anuncio' | 'perfil';

/**
 * Recuperar de la papelera.
 *
 * Es literalmente poner `eliminadoEn` a null. Que sea así de simple es la
 * razón de haber hecho el borrado suave desde el modelo de datos (doc 02) en
 * vez de borrar filas de verdad: recuperar no tiene que reconstruir nada.
 */
export async function recuperar(
  tipo: Tipo,
  id: string,
): Promise<{ ok: boolean }> {
  const sesion = await exigirPanel();
  const nota = `${sesion.usuario} recuperó un elemento de la papelera`;
  const limpiar = <T extends { id: string; eliminadoEn: string | null }>(
    xs: T[],
  ) => xs.map((x) => (x.id === id ? { ...x, eliminadoEn: null } : x));

  if (tipo === 'pregunta') {
    await guardarPreguntas(limpiar(await crudo.preguntas()), nota);
    revalidatePath('/guias');
  } else if (tipo === 'anuncio') {
    await guardarNoticias(limpiar(await crudo.noticias()), nota);
    revalidatePath('/noticias');
  } else {
    await guardarPerfiles(limpiar(await crudo.perfiles()), nota);
    revalidatePath('/consejered');
  }

  revalidatePath('/edit/panel/papelera');
  return { ok: true };
}
