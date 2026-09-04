'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { exigirPanel } from '@/lib/guardia';
import { guardarPortada } from '@/lib/contenido';

/**
 * Guardar la portada.
 *
 * Empieza por `exigirPanel()` como todas. Una acción de servidor es un punto
 * de entrada HTTP como cualquier otro: se puede llamar directamente sin pasar
 * por la pantalla, así que proteger la pantalla no protege la acción.
 *
 * La portada no tiene borradores ni papelera: es una sola pieza que siempre
 * está publicada. Guardar ES publicar, y por eso el editor enseña el
 * resultado real antes de dejar pulsar el botón.
 */

const Texto = (max: number) => z.string().trim().min(1).max(max);

const PorRol = z.object({
  estudiante: Texto(300),
  encargado: Texto(300),
  invitado: Texto(300),
});

const Entrada = z.object({
  cejilla: Texto(60),
  escuela: Texto(80),
  tituloAntes: Texto(40),
  tituloAcento: Texto(30),
  // El punto final. Es lo único que puede ir vacío.
  tituloDespues: z.string().trim().max(10),
  lede: Texto(300),
  nota: Texto(80),
  piePagina: Texto(400),
  secciones: z
    .array(
      z.object({
        clave: z.enum(['guias', 'noticias', 'consejered']),
        titulo: Texto(60),
        descripcion: PorRol,
        verbo: Texto(60),
      }),
    )
    .length(3),
  recienteEtiqueta: Texto(40),
  sinNoticias: Texto(300),
  puertaAntes: Texto(40),
  puertaAcento: Texto(30),
  puertaDespues: z.string().trim().max(10),
  puertaTexto: Texto(400),
  puertaBoton: Texto(60),
  ordenAbajo: z.enum(['noticias-puerta', 'puerta-noticias']),
});

export type ResultadoPortada = { ok: true } | { ok: false; error: string };

export async function guardarPortadaAccion(
  entrada: unknown,
): Promise<ResultadoPortada> {
  const sesion = await exigirPanel();

  const datos = Entrada.safeParse(entrada);
  if (!datos.success) {
    const fallo = datos.error.issues[0];
    const donde = fallo?.path.join('.') ?? '';
    return {
      ok: false,
      error: donde
        ? `Revisa «${donde}»: no puede quedar vacío ni ser tan largo.`
        : 'Hay algo que revisar en el texto.',
    };
  }

  // Las tres tarjetas tienen que seguir siendo las tres, sin repetidas: el
  // orden se puede cambiar, la lista no.
  const claves = new Set(datos.data.secciones.map((s) => s.clave));
  if (claves.size !== 3) {
    return { ok: false, error: 'Las tres secciones deben aparecer una vez.' };
  }

  await guardarPortada(
    datos.data,
    `${sesion.usuario} actualizó el texto de la portada`,
  );

  // La portada es la única página que hay que refrescar.
  revalidatePath('/');
  return { ok: true };
}
